export function showErrorMessages(input, message) {
  
    const errorDiv = input.parentElement.querySelector(".errorMessage");
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = "block";
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
