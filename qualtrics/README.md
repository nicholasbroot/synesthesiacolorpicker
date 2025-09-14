# Qualtrics Templates for SynesthesiaColorPicker

If you use this in your research, please cite the associated manuscript:
An open-source color picker for online synesthesia research. Preprint: https://psyarxiv.com/k7f96/

This folder contains three Qualtrics template files that you can use to create a Qualtrics experiment using SynesthesiaColorPicker. Please note that custom code is not enabled on free Qualtrics accounts, so you must have access to a paid account (e.g., through your instutution). If you do not have access to a paid Qualtrics account, use the LabJS implementation of SynesthesiaColorPicker instead.

## qualtrics_template_test_retest.qsf
This is a fully functional test-retest consistency experiment (all you need to do is replace the placeholder text for the consent form and instructions), designed to require no previous experience with Qualtrics or JavaScript. 

### Creating an experiment using this template
The step-by-step instructions for creating an experiment using this template are as follows:

1. Click qualtrics_template_test_retest.qsf above, then save it to your computer (Windows: Control-Shift-S; Mac: Command-Shift-S).
2. Log in to Qualtrics and click "Create a New Project" (bottom left of the screen).
3. Click "Survey" (under "From scratch") and then "Get started" (bottom right of the screen)
4. Under "How do you want to start your survey?", select the option "Import a QSF file". Click "Choose file", and then choose the .qsf file you saved in step 1.
5. Give your project a name, and then click "Create Project".
6. Add your consent form text to the "consent" question.
7. Add your instructions text to the "instr" question.
8. Add your break text to the "break1_instr" and "break2_instr" questions.
9. Add your debrief text to the "debrief" question.
10. (Optional) If you want to use stimuli other than the 26 uppercase letters of the Latin alphabet, click the Loop and Merge button (circular arrows icon in the top right of the colorpicker blocks) and adjust the stimuli. Note that you will have to do this for each of the three blocks (Colorpicker R1, Colorpicker R2, and Colorpicker R3).
11. Click "Publish" (top right corner), and then click "Publish" again (bottom right of the popup box).
12. You have several options for how to distribute your experiment. You can read instructions for how to use Qualtrics' distribution functions [here](https://www.qualtrics.com/support/survey-platform/distributions-module/distributions-overview/). You might also want to link the experiment to your university's participant pool; the procedure of this varies by institution, so you should refer to your university's help system (e.g., if your university uses SONA, instructions are [here](https://www.sona-systems.com/help/qualtrics/)).

### Processing the Qualtrics data
The Qualtrics export format is a bit messy because it encodes many pieces of information that you may not need for your analysis. The script `scp_preprocess_qualtrics.R` contains a sample preprocessing routine that demonstrates how to process the sample data file `scp_exampledata_qualtrics.csv`. It outputs the colorpicker responses as a dataframe with the following columns:

- id: random identifier for the participant
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

*Changing the letter stimuli* The stimuli looped through in the experiment can be changed in the "Loop and Merge" menu for each colorpicker block (the small circular icon with arrows pointing inwards, at the top right of the question block). These can be modified or added to; for example, presenting both upper and lowercase letters, presenting letters from other alphabets, etc.
*Changing the font* The font used by the experiment can be changed in the "Look and Feel" menu of Qualtrics (the paintbrush icon on the left side of the screen), under the "Style" tab. If you want to set the font to something other than the default fonts offered by Qualtrics, you can do so in the "Custom CSS" textbox; e.g., by adding `body {font-family: "Noto Serif", serif;}`. Note that if you use a non web-safe font, it is necessary to load it: In the "General" tab of the Look and Feel menu, add a link tag to the Header textbox; e.g. `<link href="https://fonts.googleapis.com/css2?family=Noto+Serif&display=swap" rel="stylesheet">`
*Changing the background color* The background color of the survey can be changed; e.g. it might be useful to make it a mid-grey so that participants can easily pick white without the letter disappearing into the background. This option is also in the "Look and Feel" menu of Qualtrics, under the "Background" tab.
*Changing the size of the colorpicker display* Changing the size and layout of the colorpicker requires slightly more comfort with searching through code, but is relatively straightforward. There are three places in which size values must be changed. (1) In the JavaScript of the colorpicker question, accessed by clicking on the question, then clicking "</>JavaScript" in the left menu; the "width" parameter of the farbtastic() function call can be changed from its default value of 250. (2) In the HTML of the colorpicker question (click in the question text area, then click the "HTML View" button on the top right), the "width" parameter of the parent div to "colorpicker1", on line 12, must be changed to the same value as in the JavaScript in step 1. (3) If you want to also change the size of the text and color swatch rectangle, you can adjust the width and height parameters of the divs on lines 1, 3, 4, and 7, in the HTML of the colorpicker question.

## Additional templates (may require more programming knowledge)
### qualtrics_template_picker_only.qsf
This is a Qualtrics template with only a single colorpicker question instance. Use this if you are familiar with Qualtrics and JavaScript and want to design your own experiment using the colorpicker. The (minimal) JavaScript attached to the question initializes the colorpicker to a random color, records the initial color, and records/updates the chosen color whenever the colorpicker is moved. The workhorse function here is the colorChange() function; you can add additional JavaScript code here that is executed whenever the user chooses a new color. You can see a basic example of this in the test-retest template, and a more advanced example of this in the color painter template.

### qualtrics_template_piping_example.qsf
This is a Qualtrics template that shows how the colorpicker can be modified to allow for "piping": using the participant's response on the colorpicker to modify a future question. Here, the participant chooses colors for letters (in this example, only the letters A/B/C), and the participant's color choices are then used in a "correct/incorrect" question to test whether the participant can identify a colored letter as consistent or inconsistent with their previous response.

The key feature is the piping variable in the second column of the Loop and Merge in the correct/incorrect question block. Notice that it has values like "${q://1_QID15/ChoiceTextEntryValue/1}", "${q://2_QID15/ChoiceTextEntryValue/1}", etc. This tells Qualtrics to pull the hex code from the participant's response to the first/second/etc. stimulus from the colorpicker question. In this example, the loop and merge field is referenced in the HTML of the question text: `<span style="font-size:80px; color: ${lm://Field/2}">${lm://Field/1} </span></div>
</div>`. Thus, on each trial, the letter in the first column of the loop and merge table is presented, colored in the color taken from the trial indicated in the second column of the loop and merge table.

This piping value might be different in your experiment; to determine what value to input, you can create a text question in Qualtrics, click "Piped Text", hover your mouse over "Survey Question", and then find the question you want to pipe in the submenu.

### qualtrics_template_bgchange_example.qsf
This is a Qualtrics template that shows how the colorpicker can be modified to have a dynamic background color behind the letter and color swatch that changes to black when the participant chooses a particularly light color. This is useful if you want to make sure they can select white and still see the letter on screen.

The key feature is the isLight() function added to the color picker JavaScript, which calculates the HSL lightness of the color and returns TRUE if it is above some threshold (in this template, it is set to a threshold of 0.8, but this parameter can be modified by changing "0.8" on line 13 of the JavaScript to another number between 0-1). Inside the colorChange() function, which is called each time the colorpicker is updated, isLight() is called in an if statement, and the background color of the div containing the letter and color swatch is updated. Note that this div does not have a name in the default template; it is added in the HTML view of the color picker question (click in the text box for the color picker question, then click "HTML View" in the top right; the relevant div is on line 3).

### qualtrics_template_painter_only.qsf
This is a Qualtrics template that shows how the colorpicker can be modified to allow for more complex user interaction. Here, the user chooses a color and a brush size and then "paints" the grapheme, allowing a synesthete to draw their multicolored association directly rather than describe it in text (as in the test-retest template). The painter is written in HTML5 Canvas and saves its data using a DataURI scheme, so you will need to know how to read this type of image data in order to analyze a trial. 