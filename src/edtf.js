/*
MIT License

Copyright (C) 2024 Fabio Mariani, Provenance Lab, Leuphana University Lüneburg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const CENTURY_RE =/(?:\d{1,3})(?:c\.?|(?:st|nd|rd|th))/g;

function parseDate(inputDate) {
    // Regular expression to match month names or numbers
    const monthNames = [
        'jan', 'january',
        'feb', 'february',
        'mar', 'march',
        'apr', 'april',
        'may',
        'jun', 'june',
        'jul', 'july',
        'aug', 'august',
        'sep', 'september',
        'oct', 'october',
        'nov', 'november',
        'dec', 'december',
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
        '01', '02', '03', '04', '05', '06', '07', '08', '09'
    ];
    // Split input date into tokens
    splitted_date = inputDate.split(/\W+/);
    const alphabeticalArray = splitted_date.filter(item => /^[a-zA-Z]+$/.test(item));
    const nonAlphabeticalArray = splitted_date.filter(item => !/^[a-zA-Z]+$/.test(item)).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
    tokens = alphabeticalArray.concat(nonAlphabeticalArray);
    let year = null;
    let month = null;
    let day = null;

    // Process tokens
    for (const token of tokens) {
        if (!year && token.match(/\b\d+\b/g)) { // Year
            year = token.padStart(4, '0');
        } else if (monthNames.includes(token) && !month) { // Month
            if (token.length <= 2) {
                month = token.padStart(2, '0');
            } else {
                month = token.slice(0, 3);
                const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                month = String(monthNames.indexOf(month) + 1).padStart(2, '0');
            }
        } else if (token.length <= 2 && token.match(/\d{1,2}/)) { // Day
            day = token.padStart(2, '0');
        }
    }
    parsed_date = `${year}-${month}-${day}`
    if (((!year)&&(!month)&&(!day))||day>31||year==0){
        return null
    }
    else{
        if (year){
            parsed_date = year
            if (month){
                parsed_date += "-" + month
                if (day){
                    parsed_date += "-" + day
                }
            }
            return parsed_date
        }
        return null
    }
}

function normalizeHyphens(text) {
    // Normalize hyphens to standard "-"
    const hyphenCharacters = ["‐", "–", "—", "−", "‑", "⁃", "­", "‒"];
    hyphenCharacters.forEach(char => {
        text = text.replace(new RegExp(char, "g"), "-");
    });
    return text;
}

function checkInterval(toks) {
    // Check interval between two dates
    let d1 = toks[0].trim();
    let d2 = toks[1].trim();

    if (/\b\d\d\b/.test(d2) && d2.length==2) { // 2-digit year partial e.g. 1809-10
        if (/\b\d\d\d\d$/.test(d1)) {
            d2 = d1.slice(-4, -2) + d2;
        }
    } else {
        const centuryRangeMatch = /\b(\d\d)(th|st|nd|rd|)-(\d\d)(th|st|nd|rd) [cC]/.exec(`${d1}-${d2}`);
        if (centuryRangeMatch) {
            const [, d1Part1, , d2Part1] = centuryRangeMatch;
            d1 = `${d1Part1}C`;
            d2 = `${d2Part1}C`;
        }
    }
    r1 = textToEdtfDate(d1);
    r2 = textToEdtfDate(d2);

    if (r1 && r2) {
        if (r2.startsWith("-")){ //upper limit is BCE --> lower limit must be BCE
            if (!r1.startsWith("-")){
                r1 = "-" + r1
            }
        }
        const result = `${r1}/${r2}`;
        return result;
    } else {
        return null;
    }
}


function TextToEdtf(text) {
    /**
     * Generate EDTF string equivalent of a given natural language date string.
     */
    if (!text) {
        return
    }
    let t = normalizeHyphens(text.toLowerCase());

    isEDTF = parseEDTFDate(t)

    if (isEDTF){
        return t
    }
    else{
        const is_single_century = t.match(CENTURY_RE) ? t.match(CENTURY_RE) : [];
        const is_single_year = t.match(/(\d{4})/g) ? t.match(/(\d{4})/g) :  t.match(/(\d{1,3}|\d{5,})/g) || [];

        if (is_single_year.length === 1 || is_single_century.length === 1) {
            // try parsing the whole thing
            result = textToEdtfDate(t);
            if (result) {
                let isBefore = /\bbefore\b|\bearlier\b|\bby\b|\bto\b|\buntil\b/.test(t);
                let isAfter = /\bafter\b|\bsince\b|\blater\b|\bas of\b/.test(t);
                if (isBefore) {
                    result = `../${result}`; // added double-dot notation
                } else if (isAfter) {
                    result = `${result}/..`; // added double-dot notation
                }
                return result;
            }
        }
        // split by list delims and move fwd with the first thing that returns a non-empty string.
        const isOr = /\bor\b/.test(t);
        if (isOr) {
            const dateContainer = [];
            t.split("or").forEach(listItem => {
                let result = textToEdtfDate(listItem);
                if (result) {
                    let isBefore = /\bbefore\b|\bearlier\b|\bby\b|\bto\b|\buntil\b/.test(t);
                    let isAfter = /\bafter\b|\bsince\b|\blater\b|\bas of\b/.test(t);
                    if (isBefore) {
                        result = `../${result}`; // added double-dot notation
                    } else if (isAfter) {
                        result = `${result}/..`; // added double-dot notation
                    }
                    dateContainer.push(result);
                }
            });
            if (dateContainer.length > 0) {
                return `[${dateContainer.join(", ")}]`;
            }
        }

        const isBetween = /\bbetween\b/.test(t);
        if (isBetween) {
            const toks = t.split("and");
            if (toks.length === 2) {
                const result = checkInterval(toks);
                if (result) {
                    return result;
                }
            }
        }

        const isFrom = /\bfrom\b/.test(t);
        if (isFrom) {
            const toks = t.split(/\bto\b|\bthrough\b/).map(item => item.trim());
            if (toks.length === 2) {
                const result = checkInterval(toks);
                if (result) {
                    return result;
                }
            }
        }

        const intervalStrings = ["by", "to", "until"];
        if (intervalStrings.some(str => t.includes(str))) {
            const toks = t.split(new RegExp(`\\b(${intervalStrings.join("|")})\\b`));
            if (toks.length === 2) {
                const result = checkInterval(toks);
                if (result) {
                    return result;
                }
            }
        }

        if (t.includes(",")) {
            const toks = t.split(",");
            if (toks.length === 2) {
                const result = checkInterval(toks);
                if (result) {
                    return result;
                }
            }
        }

        if (t.includes(";")) {
            const toks = t.split(";");
            if (toks.length === 2) {
                const result = checkInterval(toks);
                if (result) {
                    return result;
                }
            }
        }

        if (t.includes("-")) {
            const toks = t.split("-");
            if (toks.length === 2) {
                const result = checkInterval(toks);
                if (result) {
                    return result;
                }
            }
            // is it an either/or year "1838/1862" - that has a different
            // representation in EDTF. If it's 'both', then we use {}. If
            // it's 'or' then we use []. Assuming the latter for now.
            // This whole section could be more friendly.
            else {
                const intMatch = t.match(/(\d{4})\/(\d{4})/);
                if (intMatch) {
                    return `[${intMatch[1]}, ${intMatch[2]}]`;
                }
            }
        }

        if (t.includes("/")) {
            const toks = t.split("/");
            if (toks.length === 2) {
                const result = checkInterval(toks);
                if (result) {
                    return result;
                }
            }
        }
    }
}


function textToEdtfDate(text) {
    if (!text) {
        return;
    }

    let t = text.toLowerCase();
    let result = '';

    isDecade = false
    t  = t.replace(/\b(\d{3}0)s\b/g, function(match, p1) { isDecade=true; return p1 });

    isBce = false
    if (t.match(/\bbce\b|\bbc\b|\bb.c.e.\b|\bb.c.\b/)){
        isBce = true
    }

    let isApproximate = t.match(/\b(ca?\.?)\b/);
    isApproximate = isApproximate || t.match(/\bcirca\b/);
    isApproximate = isApproximate || t.match(/\b(approx|around|about|approximately)\b/);
    isApproximate = isApproximate || t.match(/\b~\d{4}\b/);
    isApproximate = isApproximate || t.match(/^\~/);

    isUncertain = false
    t  = t.replace(/(\d{4})\?/g, function(match, p1) { isUncertain=true; return p1 });
    isUncertain = isUncertain || t.match(/\b(uncertain|possibly|maybe|guess|probably)\b/);
    const isCentury = t.match(CENTURY_RE) ? t.match(CENTURY_RE) : [];
    if (isCentury.length) {
        if (isCentury.length === 1) {
            result = `${(parseInt(isCentury[0]) - 1).toString().padStart(2, '0')}xx`;
        } else {
            return;
        }
    } else {
        result = parseDate(t);
        if (!result) {
            return
        }

        if (isDecade && result.length === 4){
            result = result.slice(0, -1)+"x"
        }


        if (t.includes("spring")) {
            result = result.slice(0, 4) + "-21" + result.slice(7);
        } else if (t.includes("summer")) {
            result = result.slice(0, 4) + "-22" + result.slice(7);
        } else if (t.includes("autumn") || t.includes("fall")) {
            result = result.slice(0, 4) + "-23" + result.slice(7);
        } else if (t.includes("winter")) {
            result = result.slice(0, 4) + "-24" + result.slice(7);
        }

    }
    if (isBce){
        result = "-" +result
    }


    if (isUncertain) {
        result += "?";
    }

    if (isApproximate) {
        result += "~";
    }
    result = result.replace("?~", "%");


    return result;
}


function parseEDTFDate(edtfDate) {
    edtfDate = edtfDate.toLowerCase().trim()

    const parsedDate = {};
    parsedDate.lowerLimit = null
    parsedDate.upperLimit = null
    parsedDate.is_list = false
    parsedDate.is_range = false
    parsedDate.is_uncertain = false
    parsedDate.is_vague = false
    parsedDate.is_bce = false
    parsedDate.is_century = false
    parsedDate.is_decade = false
    parsedDate.is_year = false
    parsedDate.is_season = false
    parsedDate.is_month = false
    parsedDate.is_day = false
    parsedDate.string = edtfDate
    parsedDate.list = []
    parsedDate.range = []


    // Check if input is an array
    if (edtfDate.startsWith('[') && edtfDate.endsWith(']')) {
        try{
            edtfDate = edtfDate.replace("[","").replace("]","").split(",")
            parsedDate.is_list = true
            for (date of edtfDate){
                parsedDate.list.push(parseEDTFDate(date))
            }
            return parsedDate
        }
        catch{
            return
        }
    }

    // Check if input is a date range
    else if (edtfDate.includes("/")) {
        parsedDate.is_range = true
        //vagueness exted to the entire range in any case
        if (edtfDate.includes("?")){
            parsedDate.is_uncertain = true
        }
        if (edtfDate.includes("~")){
            parsedDate.is_vague = true
        }
        if (edtfDate.includes("%")){
            parsedDate.is_uncertain = true
            parsedDate.is_vague = true
        }
        range_split = edtfDate.split("/")
        if (range_split.length == 2){
            for (date of edtfDate.split("/")){
                if (date.trim() === ".."){
                    parsedDate.range.push(null)
                }
                else{
                    date_parse = parseEDTFDate(date)
                    if (date_parse){
                        parsedDate.range.push(parseEDTFDate(date))
                    }
                    else{
                        return
                    }
                }
            }
            if (parsedDate.range[0]){
                parsedDate.lowerLimit = parsedDate.range[0].lowerLimit
            }
            if (parsedDate.range[1]){
                parsedDate.upperLimit = parsedDate.range[1].upperLimit
            }
            return parsedDate
        }
        else{
            return
        }
    }
    // Input is a single date
    else {
        if (edtfDate.includes("?")){
            parsedDate.is_uncertain = true
            edtfDate = edtfDate.replace("?", "").trim()
        }
        if (edtfDate.includes("~")){
            parsedDate.is_vague = true
            edtfDate = edtfDate.replace("~", "").trim()
        }
        if (edtfDate.includes("%")){
            parsedDate.is_uncertain = true
            parsedDate.is_vague = true
            edtfDate = edtfDate.replace("%", "").trim()
        }
        if (edtfDate.startsWith("-")){
            edtfDate = edtfDate.slice(1).trim()
            parsedDate.is_bce = true
        }

        if (edtfDate.includes("xx")){
            parsedDate.is_century = true
            edtfCentury = edtfDate.match(/\b\d{2}xx\b/)
            if (edtfCentury.length===1){
                firstTwoDigits = parseInt(edtfCentury[0].substring(0, 2));
                if (parsedDate.is_bce){
                    firstTwoDigits = - firstTwoDigits
                    parsedDate.lowerLimit = (firstTwoDigits * 100 - 100) + "-01-01T00:00:00Z";
                    parsedDate.upperLimit = (firstTwoDigits * 100 - 1) + "-12-31T23:59:59Z";
                }
                else{
                    // Calculate lower and upper limits
                    parsedDate.lowerLimit = (firstTwoDigits * 100) + "-01-01T00:00:00Z";
                    parsedDate.upperLimit = (firstTwoDigits * 100 + 99) + "-12-31T23:59:59Z";
                }
            }
            else{
                return
            }
        }
        else if (edtfDate.includes("x")){
            parsedDate.is_decade = true
            edtfDecade = edtfDate.match(/\b\d{3}x\b/)
            if (edtfDecade.length===1){
                firstThreeDigits = parseInt(edtfDecade[0].substring(0, 3));
                if (parsedDate.is_bce){
                    firstThreeDigits = -firstThreeDigits
                }
                // Calculate lower and upper limits
                parsedDate.lowerLimit = (firstThreeDigits * 10) + "-01-01T00:00:00Z";
                parsedDate.upperLimit = (firstThreeDigits * 10 + 9) + "-12-31T23:59:59Z";
            }
            else{
                return
            }
        }
        else if (edtfDate.split('-')[0].length < 4){ //year must be always 4 digits
            return
        }
        else{
            //check already a date
            [year, month, day] = edtfDate.split('-').map(part => isNaN(part) ? null : parseInt(part));
            if (day > 31 || day == 0){
                return
            }
            if (month > 41 || (month > 12 && month < 21) || month > 24 || month == 0){
                return
            }
            if (year == 0){
                return
            }
            let startDate
            let endDate
            let isWinter = false
            // Check precision and set lower and upper limits accordingly
            if (day&&month&&year) {
                if (month <= 12){
                    parsedDate.is_day = true
                    startDate = [year, month - 1, day, 0, 0, 0]
                    endDate = [year, month - 1, day, 23, 59, 59]
                }
                else{
                    return
                }
            }
            else if (month&&year) {
                if (month >= 21 && month <= 24) {
                    let seasonStart, seasonEnd;
                    parsedDate.is_season = true
                    switch(month) {
                        case 21: // Spring
                            seasonStart = [year, 2, 20, 0, 0, 0]; // March 20th (Spring Equinox)
                            seasonEnd = [year, 5, 20, 23, 59, 59]; // June 20th (Summer Solstice)
                            break;
                        case 22: // Summer
                            seasonStart = [year, 5, 20, 0, 0, 0]; // June 20th (Summer Solstice)
                            seasonEnd = [year, 8, 22, 23, 59, 59]; // September 22nd (Autumn Equinox)
                            break;
                        case 23: // Autumn
                            seasonStart = [year, 8, 22, 0, 0, 0]; // September 22nd (Autumn Equinox)
                            seasonEnd = [year, 11, 20, 23, 59, 59]; // December 20th (Winter Solstice)
                            break;
                        case 24: // Winter
                            isWinter = true
                            seasonStart = [year, 11, 20, 0, 0, 0]; // December 20th (Winter Solstice)
                            if (parsedDate.is_bce){
                                if (year==1){
                                    seasonEnd = [1, 2, 20, 23, 59, 59];
                                }
                                else{
                                    seasonEnd = [year - 1, 2, 20, 23, 59, 59]; // March 20th (Spring Equinox) of the next year
                                }
                            }
                            else {
                                seasonEnd = [year + 1, 2, 20, 23, 59, 59]; // March 20th (Spring Equinox) of the next year
                            }
                            break;
                        default:
                            return;
                    }
                    startDate = seasonStart;
                    endDate = seasonEnd;
                }
                else {
                    parsedDate.is_month = true
                    let lastDayOfMonth = new Date(Date.UTC(2024, month, 0)).getDate();
                    startDate = [year, month - 1, 1, 0, 0, 0]
                    endDate = [year, month - 1, lastDayOfMonth, 23, 59, 59]
                }
            } else if (year) {
                parsedDate.is_year = true
                startDate = [year, 0, 1, 0, 0, 0]
                endDate = [year, 11, 31, 23, 59, 59]
            }
            else{
                return
            }
            parsedDate.lowerLimit = new Date(new Date(Date.UTC(...startDate)).setUTCFullYear(startDate[0])).toISOString().slice(0, -5) + 'Z';
            parsedDate.upperLimit = new Date(new Date(Date.UTC(...endDate)).setUTCFullYear(endDate[0])).toISOString().slice(0, -5) + 'Z';
            if (parsedDate.is_bce){
                parsedDate.lowerLimit = "-" + parsedDate.lowerLimit
                if (!(isWinter && startDate[0]==1)){
                    parsedDate.upperLimit = "-" + parsedDate.upperLimit
                }
            }

        }
        return parsedDate;
    }
}