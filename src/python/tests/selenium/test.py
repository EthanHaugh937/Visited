import time
import unittest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

from helpers.authentication import sign_in
from helpers.button_click import (
    open_add_visited_location_modal,
    open_add_wishlist_location_modal,
)


class SeleniumTestSuite(unittest.TestCase):

    def setUp(self):
        options = Options()
        options.add_argument("user-data-dir=/tmp/tarun")
        self.driver = webdriver.Chrome(options=options)

    def test_login(self):
        driver = self.driver
        sign_in(self)

        driver.find_element(By.ID, "application-title")

    def test_open_add_visited_location_modal(self):
        driver = self.driver
        sign_in(self)

        assert (
            driver.find_element(
                By.ID, "add-visited-location-modal-title"
            ).is_displayed()
            == False
        )

        open_add_visited_location_modal(self)

        time.sleep(1)

        assert driver.find_element(
            By.ID, "add-visited-location-modal-title"
        ).is_displayed()

    def test_open_add_wishlist_location_modal(self):
        driver = self.driver
        sign_in(self)

        assert (
            driver.find_element(
                By.ID, "add-wishlist-location-modal-title"
            ).is_displayed()
            == False
        )

        open_add_wishlist_location_modal(self)

        time.sleep(1)

        assert driver.find_element(
            By.ID, "add-wishlist-location-modal-title"
        ).is_displayed()

    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":
    unittest.main()
