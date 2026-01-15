import { fetchAuditLogs } from "./api.js";

const loadBtn = document.getElementById("loadLogsBtn");
const logsList = document.getElementById("logs");
const status = document.getElementById("status");

loadBtn.addEventListener("click", async () => {
  status.textContent = "Loading audit logs...";
  logsList.innerHTML = "";

  try {
    const logs = await fetchAuditLogs();

    if (!logs || logs.length === 0) {
      status.textContent = "No audit logs available.";
      return;
    }

    status.textContent = `Loaded ${logs.length} audit records`;

    logs.forEach(log => {
      const li = document.createElement("li");
      li.textContent = `${log.timestamp} | ${log.action} | ${log.resource}`;
      logsList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    status.textContent = "Backend not reachable (expected locally).";
  }
});
