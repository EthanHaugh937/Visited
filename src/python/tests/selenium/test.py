import time
import unittest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

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

    def test_list_visited_location_table(self):
        driver = self.driver
        sign_in(self)

        editVisitedBtn = driver.find_element(By.ID, "visited")
        editVisitedBtn.click()

        time.sleep(2)

        visitedTable = driver.find_element(By.ID, "visited-places-table")
        assert visitedTable.is_displayed()

    def test_list_wish_location_table(self):
        driver = self.driver
        sign_in(self)
        actions = ActionChains(driver)

        time.sleep(2)

        editWishBtn = driver.find_element(By.ID, "wish")
        actions.scroll_to_element(editWishBtn).perform()

        time.sleep(2)

        editWishBtn.click()

        time.sleep(2)

        visitedTable = driver.find_element(By.ID, "wish-list-table")
        assert visitedTable.is_displayed()

        closeBtn = driver.find_element(By.ID, "close-wish-list-table")
        closeBtn.click()

        time.sleep(2)

        # Expect error as modal should be closed and unaccessible
        try:
            visitedTable = driver.find_element(By.ID, "wish-list-table")
        except NoSuchElementException:
            pass

    def test_change_visualisation_button(self):
        driver = self.driver
        sign_in(self)

        switchBtn = driver.find_element(By.ID, "switch-visualisation-btn")

        switchBtn.get_property("ariaChecked") == "false"
        switchBtn.click()

        time.sleep(2)

        switchBtn = driver.find_element(By.ID, "switch-visualisation-btn")
        assert switchBtn.get_property("ariaChecked") == "true"

    def test_change_visualisation_button(self):
        driver = self.driver
        sign_in(self)

        accountButton = driver.find_element(By.ID, "account-button")
        accountButton.click()

        time.sleep(2)

        drawerMask = driver.find_element(By.CLASS_NAME, "ant-drawer-mask")
        assert drawerMask.is_displayed()

        logoutBtn = driver.find_element(By.ID, "logout-button")
        logoutBtn.click()

        time.sleep(2)

        try:
            driver.find_element(By.ID, "application-title")
        except NoSuchElementException as e:
            pass

    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":
    unittest.main()
