from html.parser import HTMLParser
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
PORTFOLIO_PAGES = ("websites.html", "websites-ar.html", "websites-hi.html")
ALL_PAGES = tuple(path.name for path in ROOT.glob("*.html"))
EXPECTED_URLS = {
    "https://rising-damp.com/": "assets/portfolio/rising-damp.png",
    "https://tiramissubites.ae/": "assets/portfolio/tiramissu-bites.png",
    "https://legacynest.ae/": "assets/portfolio/legacy-nest.png",
    "https://trsnafoods.com/": "assets/portfolio/trsna-foods.png",
}


class WebsitePageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.cases = []
        self.website_nav_counts = []
        self._case = None
        self._case_depth = 0
        self._in_case_number = False
        self._website_nav_depth = 0
        self._in_website_nav_count = False

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        classes = attributes.get("class", "").split()

        if tag == "a" and attributes.get("href", "").startswith("websites"):
            self._website_nav_depth = 1
        elif self._website_nav_depth:
            self._website_nav_depth += 1

        if self._website_nav_depth and tag == "small":
            self._in_website_nav_count = True

        if tag == "article" and "site-case" in classes:
            self._case = {"number": "", "hrefs": [], "images": []}
            self._case_depth = 1
            return

        if self._case is None:
            return

        self._case_depth += 1
        if tag == "a" and "href" in attributes:
            self._case["hrefs"].append(attributes["href"])
        if tag == "img" and "src" in attributes:
            self._case["images"].append(attributes["src"])
        if "case-number" in classes:
            self._in_case_number = True

    def handle_endtag(self, tag):
        if self._in_website_nav_count and tag == "small":
            self._in_website_nav_count = False

        if self._website_nav_depth:
            self._website_nav_depth -= 1

        if self._case is None:
            return

        if self._in_case_number and tag == "span":
            self._in_case_number = False

        self._case_depth -= 1
        if self._case_depth == 0:
            self.cases.append(self._case)
            self._case = None

    def handle_data(self, data):
        if self._in_website_nav_count:
            value = data.strip()
            if value:
                self.website_nav_counts.append(value)
        if self._case is not None and self._in_case_number:
            self._case["number"] += data


def parse(page):
    parser = WebsitePageParser()
    parser.feed((ROOT / page).read_text(encoding="utf-8"))
    return parser


class WebsiteCaseTests(unittest.TestCase):
    def test_localized_portfolios_publish_seventeen_numbered_cases(self):
        for page in PORTFOLIO_PAGES:
            with self.subTest(page=page):
                cases = parse(page).cases
                self.assertEqual(len(cases), 17)
                self.assertEqual(
                    [case["number"].strip() for case in cases],
                    [f"{number:02d}" for number in range(1, 18)],
                )

    def test_new_projects_link_to_live_sites_and_supplied_screenshots(self):
        for page in PORTFOLIO_PAGES:
            cases = parse(page).cases
            with self.subTest(page=page):
                for url, image in EXPECTED_URLS.items():
                    matching_cases = [case for case in cases if url in case["hrefs"]]
                    self.assertEqual(len(matching_cases), 1, url)
                    self.assertIn(image, matching_cases[0]["images"])
                    self.assertTrue((ROOT / image).is_file(), image)

    def test_navigation_reports_seventeen_website_cases(self):
        for page in ALL_PAGES:
            with self.subTest(page=page):
                self.assertEqual(parse(page).website_nav_counts, ["17"])


if __name__ == "__main__":
    unittest.main()
