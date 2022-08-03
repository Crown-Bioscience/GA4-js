javascript: (() => {

/*A JavaScript bookmarklet to automate creating Landing Page reports in GA4.*/

    /*All comments have to be in the form of multi-line strings because bookmarks condense*/
    /*JavaScript to one line so any comments will comment out the rest of the code*/

    async function generateReports(mediumText = "organic") {


/*Function to select an element based on its type and inner text - we reuse it a few times in the script*/
    function getElementsByInnerText(text, elemType, searchSpace = document) {

    const matches = [];
/*Loop through all the elements of a certain type*/
        for (const elem of searchSpace.querySelectorAll(elemType)) {

/*If any of the matching elements match our text then we put them in our match list*/
             if (elem.textContent === text) {
                matches.push(elem);
            };
        };
/*Return the list of matches*/
    return matches;
        };


    function sleep(ms) {
/*A function to sleep for the number of milliseconds passed in*/
        /*This is to avoid clicking on buttons before they are ready or spamming the page with clicks*/
        return new Promise(resolve => setTimeout(resolve, ms));
        };

    function fillMatInput(matInputField, val) {
/*A function to fill a material input with a value*/
        matInputField.value = val;
        var event = new Event('input');
        matInputField.dispatchEvent(event);
        };


        async function createMediumSessionSegment(mediumText) {

            /* CREATE A SEGMENT FOR ORGANIC TRAFFIC */

        /* Find the segments section */

        var segmentsSection = getElementsByInnerText(
            text = "Segments",
            elemType = "ga-help-tooltip",
            searchSpace = document)[0].parentElement;

        var addNewButton = segmentsSection.querySelector("md-icon");

        addNewButton.click();

        await sleep(500);

        /* Click to add a session segment */

        getElementsByInnerText(
            text = "Session segment",
            elemType = "div",
            searchSpace = document)[0].click();

        await sleep(500);

        /* Set the name for the session segment */

        var input = document.querySelector(".segment-name-input > input");
        /*input.value = mediumText + " traffic";*/

        fillMatInput(matInputField = input, val = mediumText + " traffic");

        /* Trigger the event so the form field knows we put something in it */

        /*var event = new Event('input');*/
        /*input.dispatchEvent(event);*/

        await sleep(500);


        await sleep(500);


        /* Find the "Add" button  and click it */
        getElementsByInnerText(
            text = "Add new condition",
            elemType = "div",
            searchSpace = document)[0].click();

        await sleep(1000);

        /* Find the "Events" subground and click it */
        var subgroups = document.querySelector("span .subgroup-contents");


        /* TIL we can pass lists of nodes into querySelectorAll() */
        getElementsByInnerText(
            text = "Events",
            elemType = "span",
            searchSpace = subgroups)[0].click();

        await sleep(1000);

        /* Find pageview event and click on it, then click to add parameter */
         getElementsByInnerText(
            text = "page_view",
            elemType = "span",
             searchSpace = document)[0].click();

        await sleep(500);

        document.querySelector(".add-parameter-button").click();

        await sleep(500);

        getElementsByInnerText(
            text = "Other",
            elemType = "span",
            searchSpace = document)[0].click();

        await sleep(500);

            getElementsByInnerText(
            text = "medium",
            elemType = "span",
            searchSpace = document)[0].click();

        await sleep(500);

        /* Select the field to add our 'contains' information */

        var mediumField = document.querySelector("input[aria-label='Enter a value to filter on.']");

        fillMatInput(matInputField = mediumField, val = mediumText);
        /*mediumField.value = mediumText;
        mediumField.dispatchEvent(event);*/

        await sleep(500);


        /* Apply our change */
        getElementsByInnerText(
            text = "Apply",
            elemType = "span",
            searchSpace = document)[0].click();

        await sleep(500);

        /* save */
        document.querySelector(".save-button").click();


        /* END OF CREATING SEGMENT FOR ORGANIC TRAFFIC */

        };

        async function addDimensionOrMetric(dimensionOrMetric, itemList) {
            /* Andd either a dimension ("Dimensions") or a metric ("Metrics") */

            /* Find the section */

        var section = getElementsByInnerText(
            text = dimensionOrMetric,
            elemType = "ga-help-tooltip",
            searchSpace = document)[0].parentElement;

            section.querySelector("md-icon").click();

            /* Expand all options so we can see them */

            await sleep(500);

            document.querySelector(".expand-all-button").click();

            await sleep(500);


            /* Loop through all the dimensions and metrics adding each */

            if (!Array.isArray(itemList)) {
                itemList = [itemList];
            };

            for (let i = 0; i < itemList.length; i++) {
            /* Find the dimension or metric we want to add */
                let met = itemList[i];
                getElementsByInnerText(met, "span")[0].click();
            };


            /* Apply the concepts */
            document.querySelector("button[data-guidedhelpid=apply-concepts]").click();

            return;




        };


/*Start by finding the "Explore" button in the menu*/

    var matches = getElementsByInnerText(
        text = "Explore",
        elemType = "span",
        searchSpace = document);

        matches[0].click();

        await sleep(1000);

        /*Create a new exploration*/

        document.querySelector("#template-empty > mat-card").click();

        await sleep(3000);


        /* Add organic traffic segment */
        await createMediumSessionSegment(mediumText = mediumText);

        await sleep(1000);


        /* Add landing pages as dimension */
        await addDimensionOrMetric("Dimensions", "Landing page");

        await sleep(500);

        /* Add metrics */

        var metricArray = [
                    "Views",
                    "Sessions",
                    "Engaged sessions",
                    "Total users",
                    "New users",
                    "Returning users",
                    "Engagement rate",
                    "Conversions",
                    "Total revenue",
        ];

        await addDimensionOrMetric("Metrics", metricArray);


        await sleep(500);

        /* Double-click on all of the dimensions and metrics we have available*/
        /*To add them to our table*/

        var conceptChips = document.querySelectorAll("div.concept-chip.draggable");

        var dbClickEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
        });



        for (let i = 0; i < conceptChips.length; i++) {
            let chip = conceptChips[i];
            chip.dispatchEvent(dbClickEvent);
            await sleep(500);
        };



        /* Click back out of the exploration */
        document.querySelector("button.gms-back-arrow-icon").click();

        await sleep(3000);


        /* We need to rename the report because for some reason the name doesn't stick */

        /* Click to another report screen and back to avoid weird errors when renaming */
        matches = getElementsByInnerText(
            text = "Reports",
            elemType = "span",
            searchSpace = document,
        )[0].click();

        await sleep(1000);

        matches = getElementsByInnerText(
            text = "Explore",
            elemType = "span",
            searchSpace = document,
            )[0].click();

        await sleep(3000);


        /* Assume we can click the first button because we've just created the report */
        document.querySelector("button[aria-label='More actions']").click();
        document.querySelector("button[aria-label='Rename']").click();

        await sleep(1000);

        var renameField = document.querySelector("input[aria-label='Rename exploration']");

        await fillMatInput(matInputField = renameField, val = mediumText + " landing pages");

        await sleep(1000);

        document.querySelector("button[type='submit']").click();

        await sleep(2000);

        var needsRetry = true;
        var retryAttempts = 0;

        var retryButton = document.querySelector("button[type='submit']");

        while (retryButton !== null) {
            await sleep(500*retryAttempts);
            console.log("Retry button found, retrying");

            /* Click the cancel button */
            var cancelButton = document.querySelector(".cancel");
            cancelButton.click();

            await sleep(1000);

            /* Click to another report screen and back to avoid weird errors when renaming */
            matches = getElementsByInnerText(
                text = "Reports",
                elemType = "span",
                searchSpace = document,
            )[0].click();

            await sleep(1000);

            matches = getElementsByInnerText(
                text = "Explore",
                elemType = "span",
                searchSpace = document,
                )[0].click();

            await sleep(2000);

            document.querySelector("button[aria-label='More actions']").click();
            document.querySelector("button[aria-label='Rename']").click();


            await sleep(1000);

            var renameField = document.querySelector("input[aria-label='Rename exploration']");

            if (retryAttempts > 4) {
                alert("GA4 failed to name the report - please try again");
                throw new Error("Failed to rename report");
        };


            await fillMatInput(matInputField = renameField, val = mediumText + " landing pages");

            retryButton = document.querySelector("button[type='submit']");

            retryButton.click();

            await sleep(4000);

            retryButton = document.querySelector("button[type='submit']");

            retryAttempts += 1;

            if (retryButton == null) {
                break;
            };



        };






        return;



    };

    async function loopThroughReports(loopArray) {
      for (let i = 0; i < loopArray.length; i++) {
            /* Find the dimension or metric we want to add */
        let seg = loopArray[i];
        console.log(seg);
        await generateReports(seg);
            };
    };
    console.log("Starting");

    let segmentString = prompt("Please enter the mediums you want to generate reports for (separated by commas)", "organic, email, cpc");

    let segmentArray = segmentString.split(", ").map(segment => segment.trim());

    loopThroughReports(segmentArray);

    console.log("Done!")


})();
