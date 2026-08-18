"use client";

import axios from "axios";
import { ChevronDown, ChevronUp, LoaderCircle, PencilLine, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
    useAddJobSeekerSkill,
    useDeleteJobSeekerSkill,
    useJobSeekerSkills,
    useUpdateJobSeekerSkill,
} from "../hooks/useJobSeekerProfile";

import type { JobSeekerSkill } from "../types/jobSeekerProfile";

const MAX_SKILLS = 30;
const MAX_SKILL_NAME_LENGTH = 80;

function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message ?? fallbackMessage;
    }

    return fallbackMessage;
}

function parseYearsOfExperience(value: string): number | null {
    const normalizedValue = value.trim();

    return normalizedValue === "" ? null : Number(normalizedValue);
}

function isValidExperience(value: number | null): boolean {
    return value === null || (Number.isInteger(value) && value >= 0 && value <= 60);
}

type SkillRowProps = Readonly<{
    skill: JobSeekerSkill;
    onRemove: (skill: JobSeekerSkill) => void;
}>;

function SkillRow({ skill, onRemove }: SkillRowProps) {
    const updateMutation = useUpdateJobSeekerSkill();

    const [yearsOfExperience, setYearsOfExperience] = useState(
        skill.yearsOfExperience?.toString() ?? "",
    );

    const parsedYears = parseYearsOfExperience(yearsOfExperience);
    const experienceIsValid = isValidExperience(parsedYears);
    const hasChanges = experienceIsValid && parsedYears !== skill.yearsOfExperience;

    async function handleSave() {
        if (!hasChanges || updateMutation.isPending) {
            return;
        }

        const toastId = toast.loading(`Updating ${skill.name}...`);

        try {
            const response = await updateMutation.mutateAsync({
                skillId: skill.id,
                data: {
                    yearsOfExperience: parsedYears,
                },
            });

            toast.success(response.message, {
                id: toastId,
                description:
                    parsedYears === null
                        ? `${skill.name} no longer has a specific experience value.`
                        : `${skill.name} now shows ${parsedYears} year${
                              parsedYears === 1 ? "" : "s"
                          } of experience.`,
            });
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Unable to update this skill."), {
                id: toastId,
            });
        }
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Sparkles className="size-4.5" />
                        </span>

                        <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-950">{skill.name}</p>

                            <p className="truncate text-xs text-slate-500">{skill.slug}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="w-full sm:w-44">
                        <label
                            htmlFor={`skill-experience-${skill.id}`}
                            className="text-xs font-semibold text-slate-600"
                        >
                            Years of experience
                        </label>

                        <Input
                            id={`skill-experience-${skill.id}`}
                            type="number"
                            inputMode="numeric"
                            min={0}
                            max={60}
                            step={1}
                            placeholder="Not specified"
                            value={yearsOfExperience}
                            disabled={updateMutation.isPending}
                            onChange={(event) => setYearsOfExperience(event.target.value)}
                            className="mt-1.5"
                        />

                        {!experienceIsValid && (
                            <p className="mt-1.5 text-xs text-red-600">
                                Enter a whole number from 0 to 60.
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={!hasChanges || !experienceIsValid || updateMutation.isPending}
                            onClick={() => void handleSave()}
                        >
                            {updateMutation.isPending ? (
                                <LoaderCircle className="animate-spin" />
                            ) : (
                                <Save />
                            )}
                            Save
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            disabled={updateMutation.isPending}
                            onClick={() => onRemove(skill)}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                            <Trash2 />
                            Remove
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

type RemoveSkillDialogProps = Readonly<{
    skill: JobSeekerSkill;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}>;

function RemoveSkillDialog({ skill, open, onOpenChange }: RemoveSkillDialogProps) {
    const deleteMutation = useDeleteJobSeekerSkill();

    async function handleRemove() {
        const toastId = toast.loading(`Removing ${skill.name}...`);

        try {
            const response = await deleteMutation.mutateAsync(skill.id);

            toast.success(response.message, {
                id: toastId,
                description: `${skill.name} was removed from your profile.`,
            });

            onOpenChange(false);
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Unable to remove this skill."), {
                id: toastId,
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onPointerDownOutside={(event) => event.preventDefault()}
                onEscapeKeyDown={(event) => {
                    if (deleteMutation.isPending) {
                        event.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle>Remove skill?</DialogTitle>

                    <DialogDescription>
                        <strong>{skill.name}</strong> will be removed from your job seeker profile.
                        The shared skill record will remain available for other users and job
                        listings.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={deleteMutation.isPending}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        disabled={deleteMutation.isPending}
                        onClick={() => void handleRemove()}
                        className="bg-red-600 text-white hover:bg-red-700"
                    >
                        {deleteMutation.isPending ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <Trash2 />
                        )}

                        {deleteMutation.isPending ? "Removing..." : "Remove skill"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function JobSeekerSkillsCard() {
    const skillsQuery = useJobSeekerSkills();
    const addMutation = useAddJobSeekerSkill();

    const [isExpanded, setIsExpanded] = useState(false);
    const [skillName, setSkillName] = useState("");
    const [yearsOfExperience, setYearsOfExperience] = useState("");
    const [skillBeingRemoved, setSkillBeingRemoved] = useState<JobSeekerSkill | null>(null);

    const skills = skillsQuery.data?.skills ?? [];
    const normalizedSkillName = skillName.trim().replace(/\s+/g, " ");
    const parsedYears = parseYearsOfExperience(yearsOfExperience);
    const experienceIsValid = isValidExperience(parsedYears);

    const duplicateExists = skills.some(
        (skill) => skill.name.trim().toLowerCase() === normalizedSkillName.toLowerCase(),
    );

    const canAdd =
        normalizedSkillName.length > 0 &&
        normalizedSkillName.length <= MAX_SKILL_NAME_LENGTH &&
        experienceIsValid &&
        skills.length < MAX_SKILLS &&
        !addMutation.isPending;

    async function handleAdd(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!canAdd) {
            return;
        }

        if (duplicateExists) {
            toast.error("This skill is already added to your profile.");
            return;
        }

        const toastId = toast.loading(`Adding ${normalizedSkillName}...`);

        try {
            const response = await addMutation.mutateAsync({
                name: normalizedSkillName,
                yearsOfExperience: parsedYears,
            });

            setSkillName("");
            setYearsOfExperience("");

            toast.success(response.message, {
                id: toastId,
                description: `${response.skill.name} is now part of your profile.`,
            });
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Unable to add this skill."), {
                id: toastId,
            });
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <PencilLine className="size-6" />
                            </div>

                            <div>
                                <CardTitle>Skills</CardTitle>

                                <CardDescription className="mt-1">
                                    Add the technologies, tools, and professional skills hiring companies
                                    should know about.
                                </CardDescription>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                {skills.length}/{MAX_SKILLS} skills
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                aria-expanded={isExpanded}
                                onClick={() => setIsExpanded((value) => !value)}
                            >
                                {isExpanded ? <ChevronUp /> : <ChevronDown />}
                                {isExpanded ? "Hide" : "Show"}
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {isExpanded && (
                    <CardContent className="space-y-6">
                    <form
                        onSubmit={handleAdd}
                        className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4"
                    >
                        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_190px_140px] lg:items-start">
                            <div>
                                <label htmlFor="new-skill-name" className="text-sm font-semibold">
                                    Skill name
                                </label>

                                <Input
                                    id="new-skill-name"
                                    value={skillName}
                                    maxLength={MAX_SKILL_NAME_LENGTH}
                                    placeholder="e.g. TypeScript"
                                    disabled={addMutation.isPending || skills.length >= MAX_SKILLS}
                                    onChange={(event) => setSkillName(event.target.value)}
                                    className="mt-2 bg-white"
                                />

                                <p className="mt-1.5 min-h-4 text-xs text-slate-500">
                                    {skillName.length}/{MAX_SKILL_NAME_LENGTH}
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="new-skill-experience"
                                    className="text-sm font-semibold"
                                >
                                    Years
                                    <span className="font-normal text-slate-500"> (optional)</span>
                                </label>

                                <Input
                                    id="new-skill-experience"
                                    type="number"
                                    inputMode="numeric"
                                    min={0}
                                    max={60}
                                    step={1}
                                    value={yearsOfExperience}
                                    placeholder="e.g. 2"
                                    disabled={addMutation.isPending || skills.length >= MAX_SKILLS}
                                    onChange={(event) => setYearsOfExperience(event.target.value)}
                                    className="mt-2 bg-white"
                                />

                                <p
                                    className={`mt-1.5 min-h-4 text-xs ${
                                        experienceIsValid ? "text-slate-500" : "text-red-600"
                                    }`}
                                >
                                    {experienceIsValid
                                        ? "Whole number from 0 to 60."
                                        : "Enter a whole number from 0 to 60."}
                                </p>
                            </div>

                            <div className="lg:pt-6.5">
                                <Button
                                    type="submit"
                                    disabled={!canAdd || duplicateExists}
                                    className="w-full"
                                >
                                    {addMutation.isPending ? (
                                        <LoaderCircle className="animate-spin" />
                                    ) : (
                                        <Plus />
                                    )}

                                    {addMutation.isPending ? "Adding..." : "Add skill"}
                                </Button>

                                <div
                                    aria-hidden="true"
                                    className="mt-1.5 hidden min-h-4 lg:block"
                                />
                            </div>
                        </div>

                        {duplicateExists && normalizedSkillName && (
                            <p className="mt-3 text-sm text-red-600">
                                This skill is already added to your profile.
                            </p>
                        )}

                        {!experienceIsValid && (
                            <p className="mt-3 text-sm text-red-600">
                                Years of experience must be a whole number from 0 to 60.
                            </p>
                        )}

                        {skills.length >= MAX_SKILLS && (
                            <p className="mt-3 text-sm text-amber-700">
                                You have reached the maximum of {MAX_SKILLS} skills.
                            </p>
                        )}
                    </form>

                    {skillsQuery.isPending && (
                        <div className="space-y-3">
                            <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
                            <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
                            <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
                        </div>
                    )}

                    {skillsQuery.isError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
                            <p className="font-semibold text-red-700">
                                Unable to load your skills.
                            </p>

                            <Button
                                type="button"
                                variant="outline"
                                className="mt-3"
                                onClick={() => void skillsQuery.refetch()}
                            >
                                Try again
                            </Button>
                        </div>
                    )}

                    {!skillsQuery.isPending && !skillsQuery.isError && skills.length === 0 && (
                        <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center">
                            <p className="font-semibold text-slate-900">No skills added yet</p>

                            <p className="mt-2 text-sm text-slate-600">
                                Add your strongest and most relevant skills above.
                            </p>
                        </div>
                    )}

                    {!skillsQuery.isPending && !skillsQuery.isError && skills.length > 0 && (
                        <div className="space-y-3">
                            {skills.map((skill) => (
                                <SkillRow
                                    key={`${skill.id}:${skill.yearsOfExperience ?? "none"}`}
                                    skill={skill}
                                    onRemove={setSkillBeingRemoved}
                                />
                            ))}
                        </div>
                    )}
                    </CardContent>
                )}
            </Card>

            {skillBeingRemoved && (
                <RemoveSkillDialog
                    key={skillBeingRemoved.id}
                    skill={skillBeingRemoved}
                    open
                    onOpenChange={(open) => {
                        if (!open) {
                            setSkillBeingRemoved(null);
                        }
                    }}
                />
            )}
        </>
    );
}
