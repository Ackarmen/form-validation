const form = document.querySelector("form")
const container = document.querySelector(".container")
const validationIcons = document.querySelectorAll(".icon-verif");
const validationTexts = document.querySelectorAll(".error-msg");
const userInput = document.querySelector(".input-group:nth-child(1) input");
const mailInput = document.querySelector(".input-group:nth-child(2) input");
const pswInput = document.querySelector(".input-group:nth-child(3) input");
const confirmPasswordInput = document.querySelector(".input-group:nth-child(4) input");
const lines = document.querySelectorAll(".lines div");

const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const inputValidity = {
  user: false,
  email: false,
  password: false,
  passwordConfirmation: false
}

form.addEventListener("submit", handleForm)

let isAnimating = false
function handleForm(e) {
  e.preventDefault()

  const keys = Object.keys(inputValidity)
  const failedInputs = keys.filter(key => !inputValidity[key])

  if(failedInputs.length && !isAnimating) {
    isAnimating = true
    container.classList.add("shake")
    setTimeout(() => {
      container.classList.remove("shake")
      isAnimating= false
    }, 400);

    failedInputs.forEach(input => {
      const index = keys.indexOf(input)

      showValidation({ index: index, validation: false })
    })
  }else {
    alert("Données envoyées avec succès.")
  }
}

function showValidation({ index, validation }) {
  if (validation) {
    validationIcons[index].style.display = "inline";
    validationIcons[index].src = "ressources/check.svg";
    if (validationTexts[index]) validationTexts[index].style.display = "none";
  } else {
    validationIcons[index].style.display = "inline";
    validationIcons[index].src = "ressources/error.svg";
    if (validationTexts[index]) validationTexts[index].style.display = "block";
  }
}

userInput.addEventListener("blur", userValidation);
userInput.addEventListener("input", userValidation);

function userValidation() {
  if (userInput.value.length >= 3) {
    showValidation({ index: 0, validation: true });
    inputValidity.user = true
  } else {
    showValidation({ index: 0, validation: false });
    inputValidity.user = false
  }
}

mailInput.addEventListener("blur", mailValidation);
mailInput.addEventListener("input", mailValidation);

function mailValidation() {
  if (regexEmail.test(mailInput.value)) {
    showValidation({ index: 1, validation: true });
    inputValidity.email = true
  } else {
    showValidation({ index: 1, validation: false });
    inputValidity.email = false
  }
}

pswInput.addEventListener("blur", passwordValidation);
pswInput.addEventListener("input", passwordValidation);

const passwordVerification = {
  length: false,
  symbol: false,
  number: false,
};

const regexList = {
  symbol: /[^a-zA-Z0-9\s]/,
  number: /[0-9]/,
};

let passwordValue;
function passwordValidation(e) {
  passwordValue = pswInput.value;
  let validationResult = 0;
  for (const prop in passwordVerification) {
    if (prop === "length") {
      if (passwordValue.length < 6) {
        passwordVerification.length = false;
      } else {
        passwordVerification.length = true;
        validationResult++;
      }
      continue;
    }

    if (regexList[prop].test(passwordValue)) {
      passwordVerification[prop] = true;
      validationResult++;
    } else {
      passwordVerification[prop] = false;
    }
  }

  if (validationResult !== 3) {
    showValidation({ index: 2, validation: false });
    inputValidity.password = false
  } else {
    showValidation({ index: 2, validation: true });
    inputValidity.password = true
  }

  passwordStrength();
}

function passwordStrength() {
  const passwordLength = pswInput.value.length;

  if (!passwordLength) {
    addLines(0);
  } else if (
    passwordLength > 9 &&
    passwordVerification.symbol &&
    passwordVerification.number
  ) {
    addLines(3);
  } else if (
    passwordLength > 6 &&
    (passwordVerification.symbol || passwordVerification.number)
  ) {
    addLines(2);
  } else {
    addLines(1);
  }

  function addLines(numberOfLines) {
    lines.forEach((el, index) => {
      if (index < numberOfLines) {
        el.style.display = "block";
      } else {
        el.style.display = "none";
      }
    });
  }

  if(validationIcons[3].style.display === "inline") {
    confirmPassword()
  }
}

confirmPasswordInput.addEventListener("blur", confirmPassword);
confirmPasswordInput.addEventListener("input", confirmPassword);

function confirmPassword() {
  const confirmValue = confirmPasswordInput.value

  if(!confirmValue && !passwordValue) {
    validationIcons[3].style.display = "none"
  }else if(confirmValue !== passwordValue) {
    showValidation({ index: 3, validation: false });
    inputValidity.passwordConfirmation = false
  }else {
    showValidation({ index: 3, validation: true });
    inputValidity.passwordConfirmation = true
  }
}