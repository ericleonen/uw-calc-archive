import { atom } from "jotai";
import { focusAtom } from "jotai-optics";

const questionFilterAtom = atom<QuestionFilter>({
    class: "",
    testType: "",
    topics: []
});

export const classAtom = focusAtom(questionFilterAtom, (o) => o.prop("class"));
export const testTypeAtom = focusAtom(questionFilterAtom, (o) => o.prop("testType"));
export const topicsAtom = focusAtom(questionFilterAtom, (o) => o.prop("topics"));

export default questionFilterAtom;