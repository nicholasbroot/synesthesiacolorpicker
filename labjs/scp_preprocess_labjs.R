# SynesthesiaColorPicker sample prepcessing script for lab.js test-retest consistency template
# Nicholas Root

library(tidyverse)

dat_raw <- read_csv("~/Downloads/scp_exampledata_labjs.csv") # change this to your data file name/location

# Preprocess data
dat <- dat_raw %>%
  # Process colorpicker data
  filter(sender=="ColorPicker Question") %>%
  select(stimulus=letter,
         rep,final=color_final,
         initial=color_initial) %>%
  pivot_wider(names_from=rep,
              values_from=c(final,initial),
              names_glue="{.value}{rep}") %>%
  # Process and join subjective experience questions
  left_join(dat_raw %>%
              filter(sender %in% c("Subjective Experience","Multicolor Textbox"), rep==1) %>%
              transmute(stimulus=letter,
                        n_colors=factor(ncolor,levels=c(0,1,2),labels=c(0,1,"2+")),
                        multicolor_text=multiColorExp) %>%
              group_by(stimulus) %>% summarize(across(everything(),~first(na.omit(.x)))))

print(dat)

# Example: calculate test-retest consistency Rothen et al. (2013) style
consistency <- dat %>%
  select(stimulus,starts_with("final")) %>%
  pivot_longer(starts_with("final"), names_to="rep", values_to="hex") %>%
  # transform hex to Luv color space for distance calculations
  mutate(convertColor(t(col2rgb(hex)), from="sRGB", to="Luv", scale.in=255) %>% as_tibble()) %>%
  # calculate sum CIELuv for each letter
  group_by(stimulus) %>% summarize(consistency=sum(dist(cbind(L,u,v)))) %>%
  # calculate average consistency across letters
  ungroup() %>% summarize(consistency=mean(consistency))

print(consistency)

# Example: flag participants who did not move the colorpicker
colorpicker_move <- dat %>%
  select(stimulus,starts_with("final"),starts_with("initial")) %>%
  pivot_longer(-stimulus, names_to=c("type","rep"), values_to="hex", names_pattern="(initial|final)([1-3])") %>%
  # convert to HSV
  mutate(t(rgb2hsv(col2rgb(hex))) %>% as_tibble()) %>%
  # determine whether each piece of the colorpicker was moved
  group_by(stimulus,rep) %>%
  summarize(moved=case_when(
    hex[1]==hex[2] ~ "Moved Nothing",
    h[1]==h[2] ~ "Moved Palette Only",
    (s[1]==s[2]) & (v[1]==v[2]) ~ "Moved Hue Only",
    TRUE ~ "Moved Both"
  )) %>%
  ungroup() %>%
  count(moved) %>%
  mutate(p=n/sum(n))

print(colorpicker_move)
# You can set some threshold above which you will exclude participants
# E.g., >20% of trials in which they moved nothing, or <50% of trials in which they moved both. There are many defensible options here.

# Example: visualize color choices
# Stimuli on x axis
# Reps on y axis, with first rep on the top, and last rep on the bottom
dat %>%
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
            