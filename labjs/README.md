# LabJS Templates for SynesthesiaColorPicker

If you use this in your research, please cite the associated manuscript:
An open-source color picker for online synesthesia research. Preprint: https://psyarxiv.com/k7f96/

This folder contains three LabJS template files that you can use to create a LabJS experiment using SynesthesiaColorPicker.

## labjs_template_test_retest.qsf
This is a fully functional test-retest consistency experiment (all you need to do is replace the placeholder text for the consent form and instructions), designed to require no previous experience with LabJS or Javascript. The step-by-step instructions for creating an Open Lab experiment using this template are as follows:

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

## labjs_template_picker_only_.qsf

This is a LabJS template with only a single colorpicker question instance. Use this if you are familiar with LabJS and Javascript and want to design your own experiment using the colorpicker. The (minimal) Javascript attached to the question initializes the colorpicker to a random color, records the initial color, and records/updates the chosen color whenever the colorpicker is moved. The workhorse function here is the colorChange() function; you can add additional Javascript code here that is executed whenever the user chooses a new color. You can see a basic example of this in the test-retest template, and a more advanced example of this in the color painter template.

## labjs_template_painter_only_.qsf

This is a LabJS template that shows how the colorpicker can be modified to allow for more complex user interaction. Here, the user chooses a color and a brush size and then "paints" the grapheme, allowing a synesthete to draw their multicolored association directly rather than describe it in text (as in the test-retest template). The painter is written in HTML5 Canvas and saves its data using a DataURI scheme, so you will need to know how to read this type of image data in order to analyze a trial. 