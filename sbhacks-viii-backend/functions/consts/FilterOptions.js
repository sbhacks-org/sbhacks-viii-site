const {Majors} = require("./Majors")
const {EthnicityOptions} = require("./EthnicityOptions")
const {Schools} = require("./Schools")
const {Genders} = require("./Genders")
const {GradYearOptions} = require("./GradYearOptions")
const {LevelOfStudyOptions} = require("./LevelOfStudy")
const {ShirtSizes} = require("./ShirtSizes")

const FilterOptions = [
    {
        name: "Level of Study",
        key: "studyLevel",
        options: LevelOfStudyOptions,
    }, 
    {
        name: "School",
        key: "universityName",
        options: Schools,
    },
    {
        name: "Graduation Year",
        key: "gradYear",
        options: GradYearOptions,
    },
    {
        name: "Major",
        key: "major",
        options: Majors,
    },
    {
        name: "T-shirt Size",
        key: "tshirtSize",
        options: ShirtSizes,
    },
    {
        name: "Gender",
        key: "gender",
        options: Genders,
    },
    {
        name: "Ethnicity",
        key: "ethnicity",
        options: EthnicityOptions,
    },
    {
        name: "Hear about SB Hacks",
        key: "hearAboutSBHacks",
        options: ["Email", "Website", "Social Media", "Friend/Colleague", "Workshop", "Other"],
    },
    {
        name: "Attended SB Hacks",
        key: "beenToSBHacks",
        options: ["Yes", "No"],
    },
    {
        name: "Attended Hackathon",
        key: "beenToHackathon",
        options: ["Yes", "No"],
    },
    {
        name: "Application Status",
        key: "status",
        options: ["complete", "incomplete"],
    }
];

module.exports = {FilterOptions};