import os
import time
from dotenv import load_dotenv
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

load_dotenv()


def sign_in(self):
    driver = self.driver
    driver.get("http://localhost:3000")

    # Attempt Login - Login session may be persisted across tests
    try:
        elem = driver.find_element(By.NAME, "username")
        elem.send_keys(os.environ.get("LOGIN_EMAIL"))

        elem = driver.find_element(By.NAME, "password")
        elem.send_keys(os.environ.get("LOGIN_PASSWORD"))

        elem = driver.find_element(
            By.XPATH, '//*[@id="signIn-panel"]/div/form/div/button'
        )
        elem.click()
    except NoSuchElementException:
        pass

    # Give time for login page to load
    time.sleep(3)

    # Check that the landing page is loading by checking the Visited title
    try:
        elem = driver.find_element(By.ID, "application-title")
    except NoSuchElementException as e:
        raise e
