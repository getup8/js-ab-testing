
class ABTest {
  constructor(expId, controlClass, testClass) {
    this.expGroups = ["C", "T1"];
    this.expId = expId;
    this.controlClass = controlClass;
    this.testClass = testClass;
  }

  init() {
    // Check to see if we've already stored this user's assignment.
    let assignment = this.getStoredAssignment();
    if (assignment === null || !this.expGroups.includes(assignment)) {
      assignment = this.generateRandomAssignment();
      this.storeAssignment(assignment);
    }
    this.applyTreatment(assignment);
    // Send the FullStory signal if everything went okay.
    this.logExposure(assignment);
  }

  generateRandomAssignment() {
    return Math.random() < 0.5 ? this.expGroups[0] : this.expGroups[1];
  }

  getStoredAssignment() {
    return localStorage.getItem(this.expId);
  }

  storeAssignment(expGroup) {
    localStorage.setItem(this.expId, expGroup);
  }

  show(el) {
    const requestedDisplay = el.dataset.display;
    let cssDisplay;
    if (["block", "inline-block", "flex", "inline-flex", "grid", "inline-grid"].includes(requestedDisplay)) {
      cssDisplay = requestedDisplay;
    }
    else {
      cssDisplay = "block";
    }
    el.style.display = cssDisplay;
  }

  applyTreatment(assignment) {
    // TODO: this might not work since if we put this logic at the top, the DOM will not be defined just yet, and if
    //   we put it at the bottom, it's possible the control treatment will display for an instant and then flip to the
    //   test treatment.
    const treatmentClass = (assignment === this.expGroups[1]) ? this.testClass : this.controlClass;
    const expElements = document.querySelectorAll(`.${treatmentClass}`);
    expElements.forEach((el) => {
      this.show(el);
    });
  }

  logExposure(assignment) {
    console.log(this.expId, {exp_group: assignment});
  }
}

// Example of registering an experiment.
const testAB = new ABTest("exp-do-something-cool", "control-class", "test-class");
testAB.init();
