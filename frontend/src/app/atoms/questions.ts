import { atom } from "jotai";
import { focusAtom } from "jotai-optics";

export const questionsAtom = atom<Data<Question[]>>({
    data: [],
    loading: false,
    error: null
});

export const questionsAreLoadingAtom = focusAtom(questionsAtom, (o) => o.prop("loading"));

export default questionsAtom;