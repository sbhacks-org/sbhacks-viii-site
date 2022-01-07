import React, { useState } from "react";

import {
	makeStyles,
	Checkbox,
	TextField,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	Typography
} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const useStyles = makeStyles((theme) => ({

}));

const FilterOption = (props) => {
	const updateSelections = (updateOption) => {
		let selectedOptions = [];
		let addFilter = true;
		for(let i = 0; props.selectedOptions && i < props.selectedOptions.length; i++) {
			let currOption = props.selectedOptions[i];
			if (updateOption === currOption) {
				addFilter = false;
				continue;
			}
			selectedOptions.push(currOption);
		}

		if (addFilter || !props.selectedOptions) {
			selectedOptions.push(updateOption);
		}
		// console.log(selectedOptions);
		props.selectedOptionsHandler(props.filterName, selectedOptions);
	}

	if (props.options.length < 10) {
		return (
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<FormLabel component="legend">{props.filterName}</FormLabel>
				</AccordionSummary>
				<AccordionDetails>
					<FormGroup>
						{props.options.map((option, idx) => (
							<FormControlLabel 
								key={`${props.filterName}-${option}`}
								control={<Checkbox />} 
								label={option}
								onChange={() => updateSelections(option)}
							/>
						))}
					</FormGroup>
				</AccordionDetails>
			</Accordion>
		);
	}
	else {
		return (
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<FormLabel component="legend">{props.filterName}</FormLabel>
				</AccordionSummary>
				<AccordionDetails>
					<Autocomplete 
						multiple
						options={props.options} 
						getOptionLabel={(option) => option}
						onChange={(e, value) => props.selectedOptionsHandler(props.filterName, value)}
						renderInput={(params) => <TextField {...params} label={props.filterName}/>}
					/>
				</AccordionDetails>
			</Accordion>
		);
	}
}

export default FilterOption;