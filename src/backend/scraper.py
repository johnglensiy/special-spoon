from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException

def scrape_data():
    service = Service('/usr/local/bin/geckodriver')
    driver = webdriver.Firefox(service=service)
    driver.implicitly_wait(10)  # set BEFORE get()
    driver.get("https://www.olympics.com/en/milano-cortina-2026/results/fsk/ss/w/singles-----------/fnl-/000100--/result")
    driver.maximize_window()

    # Wait object for dynamically loaded content
    wait = WebDriverWait(driver, 10)
    data = []

    # Dismiss cookie consent overlay
    try:
        accept_btn = wait.until(EC.element_to_be_clickable((By.ID, 'onetrust-accept-btn-handler')))
        accept_btn.click()
    except TimeoutException:
        pass

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

        expandable_rows = results_container.find_elements(By.CLASS_NAME, 'expandable-row')
        for row in expandable_rows:
            try:
                profile_pic_src = row.find_element(By.CSS_SELECTOR, '.profile-picture img').get_attribute('src')
            except NoSuchElementException:
                print("No profile picture found")

            cells = row.find_elements(By.TAG_NAME, 'td')
            cell_texts = [cell.text.strip() for cell in cells]
            print(cell_texts) # Verify cell order
            
            athlete = {
                'rank': int(cell_texts[0][-1]) if len(cell_texts[0]) > 2 else int(cell_texts[0][-2:]),
                'country': cell_texts[1][-3:],
                'name': cell_texts[2],
                'totalScore': float(cell_texts[5]),
                'profilePicUrl': profile_pic_src
            }

            data.append(athlete)

            # Expand row
            expand_row_btn = row.find_element(By.TAG_NAME, 'button')
            expand_row_btn.click()
            expanded_row_container = wait.until(EC.presence_of_element_located((By.TAG_NAME, 'app-figureskating-table-expanded')))
            
            technical_elements_table = expanded_row_container.find_element(By.CSS_SELECTOR, '[aria-labelledby*=technical-element-table]')
            technical_elements_table_rows = technical_elements_table.find_elements(By.TAG_NAME, 'tr')

            for tech_elem_row in technical_elements_table_rows:
                tech_cells = tech_elem_row.find_elements(By.TAG_NAME, 'td')
                tech_cell_texts = [cell.text.strip() for cell in tech_cells]
                print(tech_cell_texts)

        print(data)
        return data
        
    finally:
        driver.quit()

if __name__ == '__main__':
    scrape_data()