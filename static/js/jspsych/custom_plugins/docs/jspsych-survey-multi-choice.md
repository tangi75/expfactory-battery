# custom_plugins/jspsych-survey-multi-choice

Modified version of the original jspsych-survey-multi-choice plugin. Very similar to the jspsych-radio-buttonlist plugin but has more built-in HTML features (and less flexibility). The only difference of the custom plugin from the original right now is in how the data is stored. Instead of the original responses column with a javascript object and a long text file data for each question is stored in a separate row. 

Further modifications will include numeric codes, response range, scored responses and question data.

## Parameters

This table lists the parameters associated with this plugin. Parameters with a default value of *undefined* must be specified. Other parameters can be left unspecified if the default value is acceptable.

Parameter | Type | Default Value | Description
----------|------|---------------|------------


## Data Generated

In addition to the [default data collected by all plugins](http://docs.jspsych.org/plugins/overview/#datacollectedbyplugins), this plugin collects the following data for each trial.


Name | Type | Value
-----|------|------
response | string or numeric | What the subject saw as the response option. Each question is recorded in a separate row


## Examples

#### EXPLANATION/TITLE OF EXAMPLE

```javascript
CODE
```