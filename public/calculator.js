const genderButtons = document.querySelectorAll('input[name="gender"]');
const weightButtons = document.querySelectorAll('input[name="weight"]');
const weight = document.querySelector("#weight-input");
const age = document.querySelector("#age-input");
const biceps = document.querySelector("#biceps-input");
const triceps = document.querySelector("#triceps-input");
const subscap = document.querySelector("#subscap-input");
const suprailiac = document.querySelector("#suprailiac-input");
const calculate = document.querySelector("#calculate-btn");
const bodyfat = document.querySelector("#bodyfat-input");
const classification = document.querySelector("#classification-input");
const leanMass = document.querySelector("#lean-mass-input");
const reset = document.querySelector("#reset-btn");
const classificationPopulate = document.querySelector(
    "#classification-populate"
);
const bodyfatPopulate = document.querySelector("#bodyfat-populate");
const todayDate = document.querySelector("#today-date");
const date = new Date();
const leanmasspopulate = document.querySelector("#leanmass-populate");

calculate.addEventListener("click", () => {
    if (age.value) {
        if (weight.value) {
            const bicepsInput = parseInt(biceps.value);
            const tricepsInput = parseInt(triceps.value);
            const subscapInput = parseInt(subscap.value);
            const suprailiacInput = parseInt(suprailiac.value);
            const total = bicepsInput + tricepsInput + subscapInput + suprailiacInput;

            const bodyfatFunc = (bd) => {
                const bodyfatPercentage = 495 / bd - 450;
                return bodyfatPercentage.toFixed(2);
            };

            for (let genderButton of genderButtons) {
                if (genderButton.checked) {
                    if (genderButton.value === "male") {
                        if (age.value < 17) {
                            const bodyDensity =
                                1.1533 - 0.0643 * (Math.log(total) / Math.log(10));
                            bodyfat.value = bodyfatFunc(bodyDensity);
                        } else if (age.value < 20) {
                            const bodyDensity =
                                1.162 - 0.063 * (Math.log(total) / Math.log(10));
                            bodyfat.value = bodyfatFunc(bodyDensity);
                        } else if (age.value < 30) {
                            const bodyDensity =
                                1.1631 - 0.0632 * (Math.log(total) / Math.log(10));
                            bodyfat.value = bodyfatFunc(bodyDensity);
                        } else if (age.value < 40) {
                            const bodyDensity =
                                1.1422 - 0.0544 * (Math.log(total) / Math.log(10));
                            bodyfat.value = bodyfatFunc(bodyDensity);
                        } else if (age.value < 50) {
                            const bodyDensity =
                                1.162 - 0.07 * (Math.log(total) / Math.log(10));
                            bodyfat.value = bodyfatFunc(bodyDensity);
                        } else {
                            const bodyDensity =
                                1.1715 - 0.0779 * (Math.log(total) / Math.log(10));
                            bodyfat.value = bodyfatFunc(bodyDensity);
                        }
                    } else if (genderButton.value === "female") {
                        if (age.value < 17) {
                            const bodyDensity =
                                1.1369 - 0.0598 * (Math.log(total) / Math.log(10));
                            bodyfat.value = bodyfatFunc(bodyDensity);
                        } else if (age.value < 20) {
                            const bodyDensity =
                                1.1549 - 0.0678 * (Math.log(total) / Math.log(10));
                            bodyfat.value = bodyfatFunc(bodyDensity);
                        } else if (age.value < 30) {
                            const bodyDensity =
                                1.1599 - 0.0717 * (Math.log(total) / Math.log(10));
                            bodyfat.value = bodyfatFunc(bodyDensity);
                        } else if (age.value < 40) {
                            const bodyDensity =
                                1.1423 - 0.0632 * (Math.log(total) / Math.log(10));
                            bodyfat.value = bodyfatFunc(bodyDensity);
                        } else if (age.value < 50) {
                            const bodyDensity =
                                1.1333 - 0.0612 * (Math.log(total) / Math.log(10));
                            bodyfat.value = bodyfatFunc(bodyDensity);
                        } else {
                            const bodyDensity =
                                1.1339 - 0.0645 * (Math.log(total) / Math.log(10));
                            bodyfat.value = bodyfatFunc(bodyDensity);
                        }
                    }
                    if (
                        (genderButton.value === "male" && bodyfat.value <= 4) ||
                        (genderButton.value === "female" && bodyfat.value <= 12)
                    ) {
                        classification.value = "Essential Fat";
                    } else if (
                        (genderButton.value === "male" && bodyfat.value <= 13) ||
                        (genderButton.value === "female" && bodyfat.value <= 20)
                    ) {
                        classification.value = "Athletes";
                    } else if (
                        (genderButton.value === "male" && bodyfat.value <= 17) ||
                        (genderButton.value === "female" && bodyfat.value <= 24)
                    ) {
                        classification.value = "Fitness";
                    } else if (
                        (genderButton.value === "male" && bodyfat.value <= 25) ||
                        (genderButton.value === "female" && bodyfat.value <= 31)
                    ) {
                        classification.value = "Acceptable";
                    } else {
                        classification.value = "Obese";
                    }
                }
            }

            for (let weightButton of weightButtons) {
                if (weightButton.checked && weightButton.value == "lbs") {
                    leanMass.value =
                        (weight.value - weight.value * (bodyfat.value / 100)).toFixed(2) +
                        " lbs";
                } else {
                    leanMass.value =
                        (weight.value - weight.value * (bodyfat.value / 100)).toFixed(2) +
                        " kgs";
                }
            }
        } else {
            alert("Please enter weight");
        }
    } else {
        alert("Please enter age");
    }

    classificationPopulate.innerHTML = classification.value;
    bodyfatPopulate.innerHTML = `${bodyfat.value}%`;
    leanmasspopulate.innerHTML = leanMass.value;
    todayDate.innerHTML = `${date.getDate()}/${date.getMonth() + 1
        }/${date.getFullYear()}`;
    // date not working
});

reset.addEventListener("click", () => {
    leanMass.value = "";
    classification.value = "";
    bodyfat.value = "";
    age.value = "";
    weight.value = "";
    biceps.value = "";
    subscap.value = "";
    suprailiac.value = "";
    triceps.value = "";
    bodyfatPopulate.innerHTML = "";
    todayDate.innerHTML = "";
    classificationPopulate.innerHTML = "";
    leanmasspopulate.innerHTML = "";
});
