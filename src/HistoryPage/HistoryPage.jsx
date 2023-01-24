import React from "react";

export default function HistoryPage() {
  chrome.history.search({ text: "" }, (item) => {
    console.log(item[90].url);
    item.map((value) => {
      chrome.history.getVisits({ url: value.url }, (VisitItem) => {
        console.log(VisitItem);
      });
    });
  });
  return (
    <>
      <div>
        <p>atnother page</p>
      </div>
    </>
  );
}
