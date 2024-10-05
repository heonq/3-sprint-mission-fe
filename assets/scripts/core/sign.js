import $ from "../utils/query.js";

class Sign {
  constructor() {
    this.inputValidState = {};
    this.inputs = {};
    this.validateMethods = [];
  }

  init() {
    this.setInputs();
    this.setFormSubmit();
    this.setCloseButton();
    this.handleToggleButton();
  }

  setState(newState) {
    this.inputValidState = {
      ...this.inputValidState,
      ...newState,
    };
    $("#submit-button").disabled = Object.values(this.inputValidState).some((state) => !state);
  }

  toggleInputError(e, message = "") {
    const errorMessageNode = e.closest("section").querySelector(".message");
    errorMessageNode.innerText = message;
    if (message.length) {
      e.target.classList.add("error");
      errorMessageNode.setAttribute("aria-hidden", false);
      return errorMessageNode.classList.add("show");
    }
    e.target.classList.remove("error");
    errorMessageNode.setAttribute("aria-hidden", true);
    errorMessageNode.classList.remove("show");
  }

  setInputs() {
    Object.values(this.inputs).forEach((input, index) => {
      input.addEventListener("focusout", (e) => {
        const { value } = e.target;
        const message = this.validateMethods[index](value);
        this.toggleInputError(e, message);
        const keys = Object.keys(this.inputs);
        this.setState({ [keys[index]]: message.length === 0 });
      });
    });
  }

  setFormSubmit() {
    $("form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.onSubmit();
    });
  }

  showModal(message) {
    $("#modal-container").classList.add("show");
    $("#error-message").innerText = message;
  }

  setCloseButton() {
    $("#modal-close-button").addEventListener("click", () => {
      $("#modal-container").classList.remove("show");
    });
  }

  getValues() {
    return Object.values(this.inputs).reduce((acc, input, index) => {
      return { ...acc, [Object.keys(this.inputs)[index]]: input.value };
    }, {});
  }

  onSubmit() {}

  togglePasswordVisibility(e) {
    const { target } = e;
    target.classList.toggle("fa-eye-slash");
    target.classList.toggle("fa-eye");
    const input = target.closest("div").querySelector("input");
    const TYPES = ["text", "password"];
    const inputType = input.type;
    input.type = TYPES[Number(inputType === TYPES[0])];
  }

  handleToggleButton() {
    document
      .querySelectorAll(".eye-icon")
      .forEach((icon) => icon.addEventListener("click", this.togglePasswordVisibility));
  }
}

export default Sign;
