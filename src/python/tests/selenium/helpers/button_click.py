import time
from selenium.webdriver.common.by import By

def open_add_visited_location_modal(self):
    driver = self.driver

    elem = driver.find_element(By.XPATH, '//*[@id="root"]/div[2]/div/div[2]/button')
    elem.click()

    time.sleep(1)

    elem = driver.find_element(By.CSS_SELECTOR, "[aria-label=produce-visited-modal]")
    elem.click()

def open_add_wishlist_location_modal(self):
    driver = self.driver

    elem = driver.find_element(By.XPATH, '//*[@id="root"]/div[2]/div/div[2]/button')
    elem.click()

    time.sleep(1)

    elem = driver.find_element(By.CSS_SELECTOR, "[aria-label=produce-wishlist-modal]")
    elem.click()
