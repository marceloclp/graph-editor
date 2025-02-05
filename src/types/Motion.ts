import { motion } from "motion/react";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof motion.circle>;

export type MotionVariant = NonNullable<Props["variants"]>[string];
export type MotionInitial = NonNullable<Props["initial"]>;
export type MotionExit = NonNullable<Props["exit"]>;
export type MotionTransition = NonNullable<Props["transition"]>;
