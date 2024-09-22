# Qualtrics Templates for SynesthesiaColorPicker

If you use this in your research, please cite the associated manuscript:
An open-source color picker for online synesthesia research. Preprint: https://psyarxiv.com/k7f96/

This folder contains three Qualtrics template files that you can use to create a Qualtrics experiment using SynesthesiaColorPicker. Please note that custom code is not enabled on free Qualtrics accounts, so you must have access to a paid account (e.g., through your instutution). If you do not have access to a paid Qualtrics account, use the LabJS implementation of SynesthesiaColorPicker instead.

## qualtrics_template_test_retest.qsf
This is a fully functional test-retest consistency experiment (all you need to do is replace the placeholder text for the consent form and instructions), designed to require no previous experience with Qualtrics or Javascript. The step-by-step instructions for creating an experiment using this template are as follows:

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

## qualtrics_template_picker_only_.qsf

This is a Qualtrics template with only a single colorpicker question instance. Use this if you are familiar with Qualtrics and Javascript and want to design your own experiment using the colorpicker. The (minimal) Javascript attached to the question initializes the colorpicker to a random color, records the initial color, and records/updates the chosen color whenever the colorpicker is moved. The workhorse function here is the colorChange() function; you can add additional Javascript code here that is executed whenever the user chooses a new color. You can see a basic example of this in the test-retest template, and a more advanced example of this in the color painter template.

## qualtrics_template_painter_only_.qsf

This is a Qualtrics template that shows how the colorpicker can be modified to allow for more complex user interaction. Here, the user chooses a color and a brush size and then "paints" the grapheme, allowing a synesthete to draw their multicolored association directly rather than describe it in text (as in the test-retest template). The painter is written in HTML5 Canvas and saves its data using a DataURI scheme, so you will need to know how to read this type of image data in order to analyze a trial. 