async function getHistorys(options) {
  const history = await chrome.history.search(options);
  return history;
}

async function getVisits(options) {
  const visits = await chrome.history.getVisits(options);
  return visits;
}

export default async function getVisitsArray(options) {
  const visits = [];
  const historys = await getHistorys(options);
  historys.forEach((history) => {
    (async () => {
      const visit = await getVisits({ url: history.url });
      visits.push(visit);
    })();
  });

  return { visits, historys };
}
