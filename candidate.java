/*
==========================================
THAI MOBILE STRUCTURE FILTER
NBTC allocation order: 08 -> 09 -> 06
==========================================
*/

const VALID_MOBILE_FAMILIES = {
    "08": {
        allocationOrder: 1,
        label: "08 mobile family"
    },

    "09": {
        allocationOrder: 2,
        label: "09 mobile family"
    },

    "06": {
        allocationOrder: 3,
        label: "06 mobile family"
    }
};


/*
==========================================
ตรวจ candidate
==========================================
*/

function isValidThaiMobile(number) {

    if (!/^\d{10}$/.test(number)) {
        return false;
    }

    const prefix2 = number.substring(0, 2);

    return VALID_MOBILE_FAMILIES[prefix2] !== undefined;
}


/*
==========================================
สร้าง Candidate Space
==========================================
*/

function generateCandidates(last4) {

    const candidates = [];

    /*
    เรารู้ว่าเลขขึ้นต้นด้วย 0
    และเลขท้าย 4 ตัวรู้แล้ว

    จึงสร้างเฉพาะเลขที่อยู่ใน
    06 / 08 / 09 family
    */

    const families = ["08", "09", "06"];

    families.forEach(prefix => {

        /*
        หลัง prefix 2 หลัก
        ยังเหลือ unknown 4 หลัก
        ก่อน last4

        08 XXXX 2325
        */

        for (let i = 0; i < 10000; i++) {

            const middle =
                String(i).padStart(4, "0");

            const fullNumber =
                prefix +
                middle +
                last4;

            if (isValidThaiMobile(fullNumber)) {

                candidates.push({
                    number: fullNumber,
                    family: prefix
                });

            }
        }

    });

    return candidates;
}


/*
==========================================
NBTC STRUCTURAL PRIOR
==========================================

ไม่ได้หมายความว่า
08 = โอกาสเป็นเบอร์ของคนที่เราหา

เป็นเพียง prior เชิงโครงสร้าง
ตามลำดับการจัดสรรของ กสทช.

08 -> 09 -> 06

==========================================
*/

function getStructuralWeight(family) {

    switch (family) {

        case "08":
            return 3;

        case "09":
            return 2;

        case "06":
            return 1;

        default:
            return 0;
    }
}


/*
==========================================
คำนวณ Probability
==========================================
*/

function calculateProbabilities(candidates) {

    /*
    ห้ามเริ่ม score = 100 อีกแล้ว

    แต่ละ candidate ได้ raw weight
    จาก family ก่อน
    */

    candidates.forEach(candidate => {

        candidate.rawWeight =
            getStructuralWeight(
                candidate.family
            );

    });


    /*
    Normalize

    P(i) = Wi / ΣW
    */

    const totalWeight =
        candidates.reduce(
            (sum, candidate) =>
                sum + candidate.rawWeight,
            0
        );


    candidates.forEach(candidate => {

        candidate.probability =
            candidate.rawWeight /
            totalWeight;

    });


    return candidates;
}


/*
==========================================
วิเคราะห์
==========================================
*/

function analyzePhoneNumbers() {

    const last4 =
        document
        .getElementById("last")
        .value
        .replace(/\D/g, "");


    if (last4.length !== 4) {

        alert(
            "กรุณากรอกเลขท้าย 4 หลัก"
        );

        return;
    }


    /*
    STEP 1
    Generate valid mobile candidates
    */

    let candidates =
        generateCandidates(last4);


    /*
    STEP 2
    Calculate probability
    */

    candidates =
        calculateProbabilities(
            candidates
        );


    /*
    STEP 3
    Sort
    */

    candidates.sort(
        (a, b) =>
            b.probability -
            a.probability
    );


    /*
    ไม่ควรแสดงเป็น
    "เบอร์นี้ active แน่นอน"

    เพราะข้อมูล NBTC
    ไม่ได้บอก active SIM รายเบอร์
    */

    console.log(
        "Valid candidates:",
        candidates.length
    );


    return candidates;
}
