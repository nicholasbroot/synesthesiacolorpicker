# LabJS Templates for SynesthesiaColorPicker

If you use this in your research, please cite the associated manuscript:
An open-source color picker for online synesthesia research. Preprint: https://psyarxiv.com/k7f96/

This folder contains three LabJS template files that you can use to create a LabJS experiment using SynesthesiaColorPicker.

## labjs_template_test_retest.qsf
This is a fully functional test-retest consistency experiment (all you need to do is replace the placeholder text for the consent form and instructions), designed to require no previous experience with LabJS or Javascript.

### Creating an experiment using this template
The step-by-step instructions for creating an Open Lab experiment using this template are as follows:

1. Click labjs_template_test_retest.qsf above, then save it to your computer (Windows: Control-Shift-S; Mac: Command-Shift-S).
2. Go to the [LabJS Builder](https://labjs.felixhenninger.com/), click the downward-facing arrow (top left of the screen), and select "Open". Choose the file you saved in step 1.
3. Click "Consent Form" (left menu), then "Content" (top menu). Add your consent form text by replacing the text "YOUR CONSENT HERE".
4. Click "No Consent" (left menu), then "Content" (top menu). Add your text that will be displayed if the participant does not consent by replacing the text "YOUR NO CONSENT TEXT HERE".
5. Click "Instructions" (left menu), then "Content" (top menu). Add your instructions text by replacing the text "YOUR INSTRUCTIONS HERE".
6. Click "Break" (left menu), then "Content" (top menu). Add your break text by replacing the text "YOUR BREAK TEXT HERE". If you want to change how long participants must wait before being allowed to continue, click "Scripts" (top menu), and edit the variable let timeLeft = 10; (change the number "10" to the number of seconds that participants must wait).
7. Click "Debrief Text" (left menu), then "Content" (top menu). Add your debrief text by replacing the text "YOUR DEBRIEF TEXT HERE".
8. (Optional) If you want to use stimuli other than the 26 uppercase letters of the Latin alphabet, click "Colorpicker Trials Loop" (left menu), then "Content" (top menu). Add, delete, or replace stimuli in the "loop" box.
9. Click the downward-facing arrow (top left of the screen), and select "Upload to Open Lab". Click "Upload", and then once it has loaded, click "Manage study on Open Lab".
10. Give your task a name, enter your username/password (or create one), and click "Save".
11. Click "Studies" (top left of screen). Fill out the form to create a new study. Click "Select Tasks", then click the green plus sign next to the task you created in stop 10.
12. You have several options for how to distribute your experiment: you can see these options by clicking "Invitations". You might also want to link the experiment to your university's participant pool. The procedure of this varies by institution/system; you can read more information [here](https://open-lab.online/docs/project#integration).

### Processing the lab.js data
The lab.js export format is a bit messy because it encodes many pieces of information that you may not need for your analysis. The script `scp_preprocess_labjs.R` contains a sample preprocessing routine that demonstrates how to process the sample data file `scp_exampledata_labjs.csv`. It outputs the colorpicker responses as a dataframe with the following columns:

- stimulus: stimulus (letter of the alphabet) that was presented to the participant
- final_1, final_2, final_3: hexidecimal sRGB values for the color chosen by participants on the first, second, and third repeat, respectively.
- initial_1, initial_2, initial_3: hexidecimal sRGB values for the randomly initialized starting color on the first, second, and third repeat, repspectively
- n_colors: number of colors the participant indicates experiencing on the subjective report question
- multicolor_text: participant's free response description of their multicolor experience, if they reported experiencing more than one color for a stimulus

The script also contains a number of examples of further preprocessing, with comments explaining the function of each code snippet:

- Calculate test-retest consistency in the style of Rothen et al. (2013)
- Exclude participants who do not move the colorpicker on >x% of trials
- Visualize the test-retest trials of a single participant

### Making small modifications to this the test-retest experiment
There are several small modifications that can be made to the colorpicker without prior programming experience.

*Changing the letter stimuli*. The stimuli looped through in the experiment can be changed by clicking on the "Colorpicker Trials Loop" button in the left menu of the lab.js Builder, and then clicking on the "Content" tab. These can be modified or added to; for example, presenting both upper and lowercase letters, presenting letters from other alphabets, etc.

*Changing the font*. The font used by the experiment can be changed in the Settings menu of the lab.js Builder (the third icon from the top left, with three sliders), under the "CSS" tab. The default font is `body{font-family: serif;}`; this can be changed e.g. by adding `body {font-family: "Noto Serif", serif;}`. Note that if you use a non web-safe font, it is necessary to load it: In the "HTML" tab of same menu, add a link tag inside the `<head></head>` block ; e.g. `<link href="https://fonts.googleapis.com/css2?family=Noto+Serif&display=swap" rel="stylesheet">`

*Changing the background color*. The background color of the survey can be changed; e.g. it might be useful to make it a mid-grey so that participants can easily pick white without the letter disappearing into the background. This option is can also be changed in the Settings menu of the lab.js Builder, under the "CSS" tab. For example, add `background-color: #999999;` inside the "body" declaration: `body{font-family: serif;background-color: #999999;}`.

*Changing the size of the colorpicker display*. Changing the size and layout of the colorpicker requires slightly more comfort with searching through code, but is relatively straightforward. There are three places in which size values must be changed. (1) In the Javascript of the colorpicker question, accessed by clicking on "ColorPicker Question" in the navigation menu, then clicking "Scripts" in the top menu; the "width" parameter of the farbtastic() function call can be changed from its default value of 250. (2) In the "Content" tab of the colorpicker question, the "width" parameter of the parent div to "colorpicker1", on line 16, must be changed to the same value as in the Javascript in step 1. (3) If you want to also change the size of the text and color swatch rectangle, you can adjust the width and height parameters of the divs on lines 1, 4, 5, and 10, in the "Content" tab of the colorpicker question.

## Additional templates (may require more programming knowledge)
### labjs_template_picker_only_.qsf

This is a LabJS template with only a single colorpicker question instance. Use this if you are familiar with LabJS and Javascript and want to design your own experiment using the colorpicker. The (minimal) Javascript attached to the question initializes the colorpicker to a random color, records the initial color, and records/updates the chosen color whenever the colorpicker is moved. The workhorse function here is the colorChange() function; you can add additional Javascript code here that is executed whenever the user chooses a new color. You can see a basic example of this in the test-retest template, and a more advanced example of this in the color painter template.

### labjs_template_painter_only_.qsf

This is a LabJS template that shows how the colorpicker can be modified to allow for more complex user interaction. Here, the user chooses a color and a brush size and then "paints" the grapheme, allowing a synesthete to draw their multicolored association directly rather than describe it in text (as in the test-retest template). The painter is written in HTML5 Canvas and saves its data using a DataURI scheme, so you will need to know how to read this type of image data in order to analyze a trial. 