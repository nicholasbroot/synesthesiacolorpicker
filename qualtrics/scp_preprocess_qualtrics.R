# SynesthesiaColorPicker sample prepcessing script for Qualtrics test-retest consistency template
# Nicholas Root

library(tidyverse)

dat_raw <- read_csv("~/Downloads/scp_exampledata_qualtrics.csv") # change this to your data file name/location

# Create dictionary of stimuli that were presented (here, letters of the alphabet)
# (because Qualtrics refers to them by number)
stimuli=dat_raw %>%
  slice(1) %>%
  select(contains("ColorPick_R1_Color_1")) %>%
  pivot_longer(everything(),
               names_to="stimulus_id", 
               names_transform=parse_number,
               values_to="stimulus",
               values_transform=~str_match(.x, "\\[Field-[^]]*] - (.*) - ChosenColor")[,2]) %>%
  pull(stimulus)

# Preprocess data
dat <- dat_raw %>%
  slice(3:n()) %>%
  # Preprocess colorpicker responses
  select(id=ResponseId,contains("ColorPick"),-contains("Timing")) %>%
  pivot_longer(-id,
               names_to=c("stimulus","rep",".value"),
               names_pattern="(\\d+)_ColorPick_R(\\d+)_Color_(\\d+)",
               names_transform=list(stimulus=~stimuli[as.numeric(.x)],
                                    rep=parse_number)) %>%
  rename(final = `1`, initial = `2`) %>%
  pivot_wider(names_from=rep, values_from=c(final,initial), names_glue="{.value}{rep}") %>%
  # Preprocess and join subjective questions
  left_join(dat_raw %>%
              slice(3:n()) %>%
              select(id=ResponseId,ends_with("_NumColors"),ends_with("_MultiColor")) %>%
              pivot_longer(-id,
                           names_to=c("stimulus",".value"),
                           names_pattern="(\\d+)_(NumColors|MultiColor)",
                           names_transform=list(stimulus=~stimuli[as.numeric(.x)]),
                           values_transform=list(NumColors=~case_when(str_detect(.x,"I do not")~"0",str_detect(.x,"more than one color")~"2+",TRUE~"1")))) %>%
  rename(n_colors=NumColors, multicolor_text=MultiColor)

print(dat)


# Example: calculate test-retest consistency Rothen et al. (2013) style
consistency <- dat %>%
  select(id,stimulus,starts_with("final")) %>%
  pivot_longer(starts_with("final"), names_to="rep", values_to="hex") %>%
  # transform hex to Luv color space for distance calculations
  mutate(convertColor(t(col2rgb(hex)), from="sRGB", to="Luv", scale.in=255) %>% as_tibble()) %>%
  # calculate sum CIELuv for each letter
  group_by(id,stimulus) %>% summarize(consistency=sum(dist(cbind(L,u,v)))) %>%
  # calculate average consistency across letters
  group_by(id) %>% summarize(consistency=mean(consistency))

print(consistency)

# Example: flag participants who did not move the colorpicker
colorpicker_move <- dat %>%
  select(id,stimulus,starts_with("final"),starts_with("initial")) %>%
  pivot_longer(c(-stimulus,-id), names_to=c("type","rep"), values_to="hex", names_pattern="(initial|final)([1-3])") %>%
  # convert to HSV
  mutate(t(rgb2hsv(col2rgb(hex))) %>% as_tibble()) %>%
  # determine whether each piece of the colorpicker was moved
  group_by(id,stimulus,rep) %>%
  summarize(moved=case_when(
    hex[1]==hex[2] ~ "Moved Nothing",
    h[1]==h[2] ~ "Moved Palette Only",
    (s[1]==s[2]) & (v[1]==v[2]) ~ "Moved Hue Only",
    TRUE ~ "Moved Both"
  )) %>%
  group_by(id) %>%
  count(moved) %>%
  mutate(p=n/sum(n))

print(colorpicker_move)
# You can set some threshold above which you will exclude participants
# E.g., >20% of trials in which they moved nothing, or <50% of trials in which they moved both. There are many defensible options here.

# Example: visualize color choices of a participant
# Stimuli on x axis
# Reps on y axis, with first rep on the top, and last rep on the bottom

visualize_participant = function(id){
  dat %>%
    filter(id==!!id) %>%
    select(stimulus,starts_with("final")) %>%
    pivot_longer(starts_with("final"), names_to="rep", values_to="hex", names_transform=parse_number) %>%
    # transform hex to Luv color space for brightness calculation
    mutate(convertColor(t(col2rgb(hex)), from="sRGB", to="Luv", scale.in=255) %>% as_tibble()) %>%
    # black background for bright colors
    mutate(background=ifelse(L>95,"black","white")) %>%
    ggplot(aes(x=stimulus,y=rep,label=stimulus,color=hex,fill=background))+
    geom_tile(color=NA)+
    geom_text(size=10)+
    scale_color_identity()+
    scale_fill_identity()+
    scale_y_reverse()+
    theme_void()+
    coord_fixed(ratio=1,clip="off")
}

# Example usage
visualize_participant("R_8MQF7CEhJU7xvJO")

