from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException

def scrape_data():
    driver = webdriver.Firefox(service=Service(GeckoDriverManager().install()))
    driver.implicitly_wait(10)  # set BEFORE get()
    driver.get("https://www.olympics.com/en/milano-cortina-2026/results/fsk/ss/w/singles-----------/fnl-/000100--/result")
    driver.maximize_window()

    # Wait object for dynamically loaded content
    wait = WebDriverWait(driver, 10)

    try:
        # Poll for live event
        live_skate_div = wait.until(EC.presence_of_element_located((By.TAG_NAME, "app-figureskating-live")))
        prev_skate_container = live_skate_div.find_element(By.CLASS_NAME, "previous-competitor")
        table = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".exec-planned-elems-container table")))

        rows = table.find_elements(By.TAG_NAME, 'tr')
        for i in range(len(rows)):
            rows = table.find_elements(By.TAG_NAME, 'tr')
            cells = rows[i].find_elements(By.TAG_NAME, 'td')
            for cell in cells:
                print(cell.text)

        driver.quit()
        return
    
    except TimeoutException:
        # Event is not live
        print("Event is not live, polling for results table")
        results_container = wait.until(EC.presence_of_element_located((By.TAG_NAME, "app-table")))


    finally:
        driver.quit()


scrape_data()