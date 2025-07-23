export function showErrorMessages(input, message) {
  
    const errorDivEmail = input.parentElement.querySelector(".errorMessage");
    const errorDivPassword = input.parentElement.parentElement.querySelector(".errorMessage");
    const goalDiv = errorDivEmail ? errorDivEmail : errorDivPassword;
    if (goalDiv) {
      goalDiv.textContent = message;
      goalDiv.style.display = "block";
      input.classList.add("input-error");
    } 
  
}

export function hideErrorMessages(input) {
  const errorDiv = input.parentElement.querySelector(".errorMessage");
  if (errorDiv) {
    errorDiv.textContent = "";
    errorDiv.style.display = "none";
  }
  input.classList.remove("input-error");
}
