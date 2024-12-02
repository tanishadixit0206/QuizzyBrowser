import requests 
from bs4 import BeautifulSoup 
import os
import pandas as pd
import re
import random
from dotenv import load_dotenv
from datetime import datetime
import traceback
import logging

logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    filename='web_scraper.log')


FETCH_PROXY_URL = 'https://api.ipify.org'
PATH = os.path.join(os.path.dirname(__file__), 'data/free-proxy-list.txt')
PROXY_REFRESH_INTERVAL = 1  # IN MINUTES

class WebScraper:
    def __init__(self):
        os.makedirs(os.path.join(os.path.dirname(__file__), 'data'), exist_ok=True)
        self.proxyList = []
        self.generate_proxy_file()
        self.create_proxy_list()

    def generate_proxy_file(self):
        try:
            data = requests.get(FETCH_PROXY_URL)
            with open(PATH, 'w') as file:
                file.write(data.text)
            logging.info("Proxy file generated successfully")
        except Exception as e:
            logging.error(f"Error generating proxy file: {e}")

    def create_proxy_list(self):
        try:
            with open(PATH) as file:
                self.proxyList = [file.readline().split('\n')[0] for _ in range(20)]
            logging.info(f"Created proxy list with {len(self.proxyList)} proxies")
        except Exception as e:
            logging.error(f"Error creating proxy list: {e}")
        return self.proxyList

    def time_file_update_check(self, current_hour, current_minute):
        time_file_path = os.path.join(os.path.dirname(__file__), 'data/time.txt')
        
        if not os.path.exists(time_file_path):
            with open(time_file_path, 'w') as f:
                f.write(f'{current_hour}:{datetime.now()}')
            return True

        with open(time_file_path) as file:
            timeString = file.read()
            prevHour = int(timeString.split(' ')[1].split(':')[0])
            prevMinute = int(timeString.split(' ')[1].split(':')[1])

        current_hour, current_minute = int(current_hour), int(current_minute)

        if current_hour - prevHour > 1:
            return True
        
        if 0 <= current_hour - prevHour <= 1:
            adjusted_minute = current_minute + 60 * (current_hour - prevHour)
            return adjusted_minute - prevMinute > PROXY_REFRESH_INTERVAL

        return current_hour - prevHour < 0

    def get_random_proxy(self):
        current_hour, current_minute = datetime.now().hour, datetime.now().minute
        
        if self.time_file_update_check(current_hour, current_minute):
            with open(os.path.join(os.path.dirname(__file__), 'data/time.txt'), 'w') as f:
                f.write(f'{current_hour}:{datetime.now()}')
            self.generate_proxy_file()
            self.create_proxy_list()

        return random.choice(self.proxyList) if self.proxyList else None

    def search(self, query):
        try:
            proxy = self.get_random_proxy()
            proxies = {'http': f'http://{proxy}', 'https': f'https://{proxy}'} if proxy else None

            google_search = requests.get(
                f"https://www.google.com/search?q={query} geekforgeeks", 
                proxies=proxies
            )

            soup = BeautifulSoup(google_search.text, "html.parser")
            soup.prettify()

            url_to_parse = ""
            for parent in soup.find("h3").parents:
                if parent.name == 'a' and "geeksforgeeks" in parent["href"]:
                    url_to_parse = parent['href'].split('q=')[1].split('&')[0]
                    break

            if not url_to_parse:
                logging.warning("No GeeksforGeeks URL found")
                return None

            gfg_req = requests.get(url_to_parse, proxies=proxies)
            gfg = BeautifulSoup(gfg_req.text, "html.parser")

            data = self._extract_content(gfg, query)
            return data

        except Exception as e:
            logging.error(f"Error in search: {e}")
            logging.error(traceback.format_exc())
            return None

    def _extract_content(self, gfg, query):
        data = []
        
        h1_list = gfg.select("h1")
        title = h1_list[0].get_text() if h1_list else "Untitled"
        data.append(title)

        articles = gfg.select("article")
        gfg_panel = gfg.find_all("gfg-panel")
        
        if not articles:
            logging.warning("No articles found")
            return None

        article = articles[0]
        i = 0

        for c in article.children:
            if c.name == "div":
                i += 1
                if i == 3:
                    data.extend(self._process_div_children(c, gfg_panel, query))
                    break

        updated_data = self._clean_data(data)
        
        article_text = ""
        for item in updated_data:
            if isinstance(item, pd.DataFrame):
                logging.info(f"DataFrame columns: {item.columns}")
                logging.info(f"DataFrame shape: {item.shape}")
                
                filename = os.path.join(os.path.dirname(__file__), f'data/{query.split(" ")[0]}.csv')
                item.to_csv(filename, sep='\t', index=False)
                logging.info(f"Saved DataFrame to {filename}")
            else:
                article_text += item + '\n'

        return article_text if article_text.strip() else None

    def _process_div_children(self, div, gfg_panel, query):
        data = []
        for child in div.children:
            if child.name == "gfg-tabs":
                data.extend(g.get_text() + "\n" for g in gfg_panel if child in g.parents)
            elif child.name == "div" and child.get("id") == "table_of_content":
                continue
            elif child.name == "p":
                data.append(child.get_text() + "\n")
            elif child.name == "ul":
                data.extend(f"{idx+1} {li.get_text()}\n" for idx, li in enumerate(child.children))
            elif child.name == "table":
                data.append(f"///RESPECTIVE TABLE IS SAVED IN {query.split(' ')[0]}.csv FILE")
                table_data = self._process_table(child, query)
                if table_data:
                    data.extend(table_data)
            elif child.name == "br":
                break
            else:
                data.append(child.get_text() + "\n")
        return data

    def _process_table(self, table, query):
        try:
            body = table.find_all("tr")
            if not body:
                logging.warning("No table rows found")
                return []

            head = body[0]
            body_rows = body[1:]
            
            headings = [item.text.strip().rstrip("\n") for item in head.find_all("th")]
            logging.info(f"Table headings: {headings}")
            
            all_rows = []
            for row_num in range(len(body_rows)):
                row = [re.sub(r"(\xa0)|(\n)|,|\s+", "", row_item.text).strip() 
                       for row_item in body_rows[row_num].find_all("td")]
                
                logging.info(f"Row {row_num+1}: {row}")
                
                if len(row) == len(headings):
                    all_rows.append(row)
                else:
                    logging.warning(f"Skipping row {row_num+1}: {len(row)} columns (expected {len(headings)})")

            if all_rows:
                df = pd.DataFrame(data=all_rows, columns=headings)
                return [df]
            else:
                logging.warning("No valid rows found in the table")
                return []

        except Exception as e:
            logging.error(f"Error processing table: {e}")
            logging.error(traceback.format_exc())
            return []

    def _clean_data(self, data):
        updated_data = []
        for item in data:
            if isinstance(item, str) and "\n" in item:
                updated_list = [line for line in item.split("\n") if line.strip()]
                updated_data.append('\n'.join(updated_list))
            else:
                updated_data.append(item)
        return updated_data

if __name__ == "__main__":
    scraper = WebScraper()
    result = scraper.search("DFS")
    if result:
        print(result)
    else:
        print("No results found.")
