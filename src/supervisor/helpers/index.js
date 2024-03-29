import date from "date-and-time";

export default function tableToCSV(fileName = "csv-format.csv", table) {
  // Variable to store the final csv data
  var csv_data = [];

  // Get each row data
  var rows = table.getElementsByTagName("tr");

  for (var i = 0; i < rows.length; i++) {
    // Get each column data
    var cols = rows[i].querySelectorAll("td,th");

    // Stores each csv row data
    var csvrow = [];
    for (var j = 0; j < cols.length; j++) {
      // Get the text data of each cell
      // of a row and push it to csvrow
      csvrow.push(cols[j].innerHTML);
    }

    // Combine each column value with comma
    csv_data.push(csvrow.join(","));
  }

  // Combine each row data with new line character
  csv_data = csv_data.join("\n");

  // Call this function to download csv file
  downloadCSVFile(csv_data, fileName);
}

export function downloadCSVFile(csv_data, fileName) {
  // Create CSV file object and feed
  // our csv_data into it

  let CSVFile = new Blob([csv_data], {
    type: "text/csv",
  });

  // Create to temporary link to initiate
  // download process
  var temp_link = document.createElement("a");

  // Download csv file
  temp_link.download = `${fileName}`;
  var url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;

  // This link should not be displayed
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  // Automatically click the link to
  // trigger download
  temp_link.click();
  document.body.removeChild(temp_link);

  // const table = document.querySelector("#download-csv");
  // document.body.removeChild(table);
}
export function convertDeliveryDay(dateArg) {
  // delivery date
  const currentDate = new Date();

  const today = date.format(new Date(), "DD-MM-YYYY");
  const tommorow = date.format(
    new Date(currentDate.setDate(currentDate.getDate() + 1)),
    "DD-MM-YYYY"
  );
  const dlvryDate = date.format(new Date(dateArg), "DD-MM-YYYY");

  switch (dlvryDate) {
    case today:
      return "Today";
      break;
    case tommorow:
      return "Tomorrow";
      break;
    default:
      return dlvryDate;
  }
}

export const printElement = (elementId) => {
  let printContents = document.getElementById(elementId).innerHTML;
  let originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
};
