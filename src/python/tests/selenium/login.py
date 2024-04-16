import time
import unittest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from dotenv import load_dotenv
import os

load_dotenv()


class Login(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome

    def sign_in(self):
        driver = self.driver
        driver.get("https://dev.d2rsi8yv6bvbyk.amplifyapp.com/")
        elem = driver.find_element(By.NAME, "username")
        elem.send_keys(os.environ.get("LOGIN_EMAIL"))
        
        elem = driver.find_element(By.NAME, "password")
        elem.send_keys(os.environ.get("LOGIN_PASSWORD"))

        elem = driver.find_element(By.XPATH, '//*[@id="signIn-panel"]/div/form/div/button')
        elem.click()

if __name__ == "__main__":
    unittest.main()