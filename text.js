(function () {
  setTimeout(() => {
    const inquiryForm = document.getElementById("forminator-module-1468");
    if (inquiryForm) {
      inquiryForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let formData = {};

        // Name
        let name = document.querySelector('[name="name-1"]');
        formData.Name = name.value;

        // Email
        let email = document.querySelector('[name="email-1"]');
        formData.Email = email.value;

        // Phone
        let phone = document.querySelector('[name="phone-1"]');
        formData.Mobile = phone.value;

        // Sqft
        let sqFit = document.querySelector('[name="number-1"]');
        formData.Optional16 = sqFit.value;

        // city
        let city = document.querySelector('[name="select-1"]');
        formData.Optional17 = city.value;

        // Where did you hear about
        let leadSource = document.querySelector('[name="select-2"]');
        formData.leadSource = leadSource.value;

        // When do you plan to start construction (Select one from dropdown) *
        let whenDidPlan = document.querySelector('[name="select-3"]');
        formData.Optional18 = whenDidPlan.value;

        // Total built up area that including of Basement/Stilt & all floor (in sq ft) *
        let buildUpArea = document.querySelector('[name="number-2"]');
        formData.Optional19 = buildUpArea.value;

        // Basement
        let basement = document.querySelector('[name="radio-1"]:checked');
        formData.Optional20 = basement.value;

        // Stilt
        let stilt = document.querySelector('[name="radio-2"]:checked');
        formData.Optional21 = stilt.value;

        try {
          jQuery.ajax({
            url: `https://salesnayak.com/API/AddLead?Mobile=${formData.Mobile}&Name=${formData.Name}&Email=${formData.Email}&Address=${formData.Optional17}&CompanyName=${formData.Name}&LeadTypeCode=169155&LeadValue=o&Companycode=860247&LeadStageCode=21136&LeadStatus=20200&LeadSourceCode=${formData.leadSource}&remarks=xxxx&Empid=XXX&Optional16=${formData.Optional16}&Optional17=${formData.Optional17}&Optional18=${formData.Optional18}&Optional19=${formData.Optional19}&Optional20=${formData.Optional20}&Optional21=${formData.Optional21}`,
            type: "GET",
            success: function (data) {
              console.log(data);
            },
          });
        } catch (error) {
          console.log(error);
        }

        setTimeout(() => {
          console.log("Welcome");
          inquiryForm.submit();
        }, 2000);
      });
    }

    // 2nd form
    const homeConstructionForm = document.getElementById(
      "forminator-module-3614"
    );
    if (homeConstructionForm) {
      homeConstructionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let formData = {};
        // Name
        let name = document.querySelector('[name="name-1"]');
        formData.Name = name.value;

        // Email
        let email = document.querySelector('[name="email-1"]');
        formData.Email = email.value;

        // Phone
        let phone = document.querySelector('[name="phone-1"]');
        formData.Mobile = phone.value;

        // City
        let city = document.querySelector('[name="text-1"]');
        formData.City = city.value;

        console.log(formData);
        try {
          jQuery.ajax({
            url: `https://salesnayak.com/API/AddLead?Mobile=${formData.Mobile}&Name=${formData.Name}&Email=${formData.Email}&Address=${formData.City}&CompanyName=${formData.Name}&LeadTypeCode=169155&LeadValue=o&Companycode=860247&LeadStageCode=21136&LeadStatus=20200&LeadSourceCode=9768&remarks=xxxx&Empid=XXX`,
            type: "GET",
            success: function (data) {
              console.log(data);
            },
          });
        } catch (error) {
          console.log(error);
        }

        setTimeout(() => {
          console.log("Welcome");
          homeConstructionForm.submit();
        }, 4000);
      });
    }
  }, 1000);
})();
