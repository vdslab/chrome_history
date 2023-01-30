async function getHistorys(options) {
  const history = await chrome.history.search(options);
  return history;
}

async function getVisits(options) {
  const visits = await chrome.history.getVisits(options);
  return visits;
}

export default function getVisitsArray(options) {
  const visits = [];
  getHistorys(options).then((historys) => {
    historys.forEach((history) => {
      getVisits({ url: history.url }).then((visit) => {
        visits.push(visit);
      });
    });
  });
  return visits;
}
