const { Majors } = require("./Majors");
const { EthnicityOptions } = require("./EthnicityOptions");
const { Schools } = require("./Schools");
const { Genders } = require("./Genders");
const { GradYearOptions } = require("./GradYearOptions");
const { LevelOfStudyOptions } = require("./LevelOfStudy");
const { ShirtSizes } = require("./ShirtSizes");
const { RatingOptions } = require("./RatingOptions");

const FilterOptions = {
  studyLevel: LevelOfStudyOptions,
  universityName: Schools,
  gradYear: GradYearOptions,
  major: Majors,
  tshirtSize: ShirtSizes,
  gender: Genders,
  ethnicity: EthnicityOptions,
  hearAboutSBHacks: [
    "Email",
    "Website",
    "Social Media",
    "Friend/Colleague",
    "Workshop",
    "Other",
  ],
  beenToSBHacks: ["Yes", "No"],
  beenToHackathon: ["Yes", "No"],
  status: ["incomplete", "complete"],
  rating: RatingOptions,
};

module.exports = { FilterOptions };
