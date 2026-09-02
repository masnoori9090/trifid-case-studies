from html.parser import HTMLParser
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
PAGES = ("index.html", "index-ar.html", "index-hi.html")


class CaseBioParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.bios = []
        self._bio = None
        self._item = None
        self._depth = 0

    def handle_starttag(self, tag, attrs):
        classes = dict(attrs).get("class", "").split()
        if "deck-case-bio" in classes:
            self._bio = {}
            self._depth = 1
            return

        if self._bio is None:
            return

        self._depth += 1
        for kind in ("before", "after", "spend"):
            if f"deck-case-bio__item--{kind}" in classes:
                self._item = kind
                self._bio[kind] = ""
                break

    def handle_endtag(self, tag):
        if self._bio is None:
            return

        self._depth -= 1
        if self._depth == 0:
            self.bios.append(self._bio)
            self._bio = None
            self._item = None

    def handle_data(self, data):
        if self._bio is not None and self._item is not None:
            self._bio[self._item] += data


class CaseBioTests(unittest.TestCase):
    def test_every_result_card_exposes_before_after_and_spend(self):
        for page in PAGES:
            with self.subTest(page=page):
                parser = CaseBioParser()
                parser.feed((ROOT / page).read_text(encoding="utf-8"))

                self.assertEqual(len(parser.bios), 12)
                for bio in parser.bios:
                    self.assertEqual(set(bio), {"before", "after", "spend"})
                    self.assertTrue(all(value.strip() for value in bio.values()))


if __name__ == "__main__":
    unittest.main()
