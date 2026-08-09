import type { Metadata } from "next";

import LegalDocumentPage, {
    LegalContentLink,
} from "@/features/legal/components/LegalDocumentPage";
import { createPublicPageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = createPublicPageMetadata({
    title: "Privacy Policy",
    description:
        "Learn how JobsSpot collects, uses, shares, protects, and retains personal information.",
    path: "/privacy",
});

const effectiveDate = "August 10, 2026";

const sections = [
    {
        id: "scope",
        title: "Scope and who we are",
        content: (
            <>
                <p>
                    This Privacy Policy explains how JobsSpot collects, uses,
                    stores, shares, and protects personal information when you
                    use our website, job-seeker services, employer workspace,
                    company pages, job listings, applications, email features,
                    and related services.
                </p>
                <p>
                    JobsSpot is operated from New York, United States. In this
                    policy, <strong>JobsSpot</strong>, <strong>we</strong>,
                    <strong> us</strong>, and <strong>our</strong> refer to the
                    JobsSpot platform. <strong>You</strong> refers to a visitor,
                    job seeker, employer representative, company team member,
                    applicant, or other person who interacts with JobsSpot.
                </p>
            </>
        ),
    },
    {
        id: "information-we-collect",
        title: "Information we collect",
        content: (
            <>
                <p>Depending on how you use JobsSpot, we may collect:</p>
                <ul>
                    <li>
                        <strong>Account and identity information</strong>, such
                        as your name, email address, phone number, profile image,
                        email-verification status, authentication method, and
                        account-security information.
                    </li>
                    <li>
                        <strong>Job-seeker information</strong>, such as your
                        profile summary, skills, employment history, education,
                        certifications, resumes, saved jobs, saved searches, job
                        preferences, applications, and application activity.
                    </li>
                    <li>
                        <strong>Employer and company information</strong>, such
                        as company profile details, branding images, company
                        memberships, assigned roles, job postings, applicant
                        actions, and workspace activity.
                    </li>
                    <li>
                        <strong>Communications</strong>, including contact-form
                        messages, email requests, support correspondence, and
                        invitation details.
                    </li>
                    <li>
                        <strong>Technical and usage information</strong>, such
                        as IP address, browser and device information, request
                        timestamps, session and security events, error logs, and
                        interactions used to operate and protect the platform.
                    </li>
                </ul>
                <p>
                    We do not ask you to include passwords, payment-card details,
                    government identification numbers, or unrelated sensitive
                    information in contact messages, resumes, or free-text fields.
                </p>
            </>
        ),
    },
    {
        id: "how-we-collect",
        title: "How we collect information",
        content: (
            <>
                <p>We collect information:</p>
                <ul>
                    <li>directly from you when you register, complete a profile, upload a resume, apply for a job, publish a job, invite a team member, or contact us;</li>
                    <li>from employers and company team members when they manage jobs, applicants, roles, and company information;</li>
                    <li>from Google when you choose to sign in with Google, subject to the permissions and information shown during sign-in;</li>
                    <li>automatically through cookies, session technology, server logs, and security controls needed to operate the service.</li>
                </ul>
            </>
        ),
    },
    {
        id: "how-we-use",
        title: "How we use information",
        content: (
            <>
                <p>We use personal information to:</p>
                <ul>
                    <li>create and secure accounts, verify email addresses, authenticate sessions, and recover account access;</li>
                    <li>provide job search, profile, resume, saved-job, saved-search, application, employer, company, and team-management features;</li>
                    <li>deliver submitted applications and the selected resume to the relevant employer;</li>
                    <li>send service emails, security notices, verification messages, password-reset messages, company invitations, and contact confirmations;</li>
                    <li>prevent spam, fraud, abuse, unauthorized access, and violations of our Terms;</li>
                    <li>maintain audit records, troubleshoot errors, improve reliability, and understand how core features are used;</li>
                    <li>comply with legal obligations and respond to lawful requests.</li>
                </ul>
                <p>
                    We use personal information to provide the services you
                    request, with consent where required, and for business,
                    security, fraud-prevention, recordkeeping, and legal purposes
                    permitted by applicable United States federal and state law.
                </p>
            </>
        ),
    },
    {
        id: "applications-employers",
        title: "Job applications and employer access",
        content: (
            <>
                <p>
                    When you apply for a job, JobsSpot shares the application
                    information and the exact resume you selected with the
                    employer that posted the job and with authorized members of
                    that employer&apos;s company workspace. Employers may use that
                    information to evaluate your application, contact you, and
                    update your application status.
                </p>
                <p>
                    Employers are responsible for handling applicant information
                    lawfully and only for legitimate recruitment purposes. Their
                    independent handling of information outside JobsSpot may be
                    governed by their own privacy practices.
                </p>
            </>
        ),
    },
    {
        id: "sharing",
        title: "When we share information",
        content: (
            <>
                <p>We may share information with:</p>
                <ul>
                    <li>
                        <strong>Employers and authorized company members</strong>
                        when you apply for a job or interact with their company
                        workspace.
                    </li>
                    <li>
                        <strong>Service providers</strong> that support hosting,
                        databases, authentication, email delivery, file storage,
                        media processing, security, and platform operations. Our
                        current integrations may include Google for sign-in,
                        Resend for transactional email, Cloudinary for company
                        images, and Cloudflare R2 or similar storage for private
                        files such as resumes.
                    </li>
                    <li>
                        <strong>Authorities or other parties</strong> when
                        required by law, legal process, or a valid government
                        request, or when reasonably necessary to protect users,
                        JobsSpot, or the public from fraud, abuse, or security
                        threats.
                    </li>
                    <li>
                        <strong>A successor organization</strong> in connection
                        with a merger, acquisition, restructuring, financing, or
                        transfer of the platform, subject to appropriate privacy
                        safeguards.
                    </li>
                </ul>
                <p>
                    JobsSpot does not currently sell personal information or
                    share it for cross-context behavioral advertising, as those
                    terms are defined by applicable state privacy laws. We do not
                    allow service providers to use personal information for their
                    own unrelated marketing purposes.
                </p>
            </>
        ),
    },
    {
        id: "cookies-sessions",
        title: "Cookies and session technology",
        content: (
            <>
                <p>
                    JobsSpot uses cookies and related browser storage to keep you
                    signed in, rotate and protect sessions, remember necessary
                    preferences, preserve certain return paths, and maintain
                    platform security. Disabling essential cookies may prevent
                    account and employer features from working correctly.
                </p>
                <p>
                    JobsSpot may use Google Analytics to understand aggregate
                    website traffic, page visits, and feature usage. When enabled,
                    Google Analytics may use analytics cookies or similar
                    technologies and process information such as browser and
                    device details, pages viewed, interactions, and approximate
                    location derived from network information. JobsSpot does not
                    use analytics to expose resumes, application documents, or
                    account passwords to other users.
                </p>
                <p>
                    Where applicable, JobsSpot will maintain any consent,
                    disclosure, or opt-out controls required for non-essential
                    analytics technology.
                </p>
            </>
        ),
    },
    {
        id: "retention",
        title: "Data retention",
        content: (
            <>
                <p>
                    We retain personal information for as long as reasonably
                    necessary to provide the service, maintain account and
                    application history, meet security and audit requirements,
                    resolve disputes, enforce agreements, and comply with law.
                </p>
                <p>
                    Retention periods vary by record. For example, verification
                    and password-reset tokens expire quickly, while application,
                    company, security, and audit records may be retained longer
                    where necessary for legitimate operational or legal reasons.
                    Deleted or withdrawn information may remain temporarily in
                    backups or restricted logs until routine deletion cycles are
                    completed.
                </p>
            </>
        ),
    },
    {
        id: "security",
        title: "Security",
        content: (
            <>
                <p>
                    We maintain administrative, technical, and organizational
                    safeguards designed to protect personal information and to
                    support compliance with applicable data-security laws,
                    including the New York SHIELD Act when it applies. These
                    safeguards include password hashing, email verification,
                    access controls, role-based permissions, rotating sessions,
                    rate limits, private file access, validation, audit logging,
                    and security middleware.
                </p>
                <p>
                    No internet service can guarantee absolute security. You are
                    responsible for using a strong, unique password, protecting
                    your devices and email account, and notifying us promptly if
                    you suspect unauthorized access.
                </p>
            </>
        ),
    },
    {
        id: "international-processing",
        title: "International processing",
        content: (
            <p>
                JobsSpot is operated from the United States. JobsSpot and its
                service providers may process or store information in the United
                States and other countries. Privacy and data-protection laws in
                those locations may differ from the laws where you live. Where
                required, we use reasonable contractual, technical, and
                organizational safeguards for cross-border processing.
            </p>
        ),
    },
    {
        id: "your-rights",
        title: "Your choices and U.S. state privacy rights",
        content: (
            <>
                <p>
                    Depending on where you live and whether an applicable law
                    covers JobsSpot, you may have rights to confirm whether we
                    process your personal information; access, correct, or delete
                    it; obtain a portable copy; opt out of certain sales, sharing,
                    targeted advertising, or qualifying profiling; and appeal a
                    denied request. JobsSpot does not currently sell personal
                    information or use it for targeted advertising.
                </p>
                <p>
                    Some information can be reviewed or updated directly through
                    your account. You can withdraw applications where the feature
                    is available, manage saved items, update profile information,
                    change your password, and contact us for requests that cannot
                    be completed through account settings.
                </p>
                <p>
                    We may need to verify your identity and authority before
                    completing a request. Rights are subject to lawful exceptions,
                    including records retained for security, fraud prevention,
                    contractual, evidentiary, or legal reasons. We will not
                    unlawfully discriminate against you for exercising an
                    applicable privacy right. To submit a request or appeal, use
                    the <LegalContentLink href="/#contact">JobsSpot contact form</LegalContentLink> and select the most relevant inquiry type.
                </p>
            </>
        ),
    },
    {
        id: "children",
        title: "Children and minors",
        content: (
            <>
                <p>
                    JobsSpot is designed for employment and recruitment activities
                    and is not directed to children under 13. We do not knowingly
                    collect personal information from a child under 13 without the
                    notice and verifiable parental consent required by the U.S.
                    Children&apos;s Online Privacy Protection Act.
                </p>
                <p>
                    Users under 18 should use JobsSpot only when legally permitted
                    and with parent or guardian involvement where required. For New
                    York users under 18, we limit collection, use, sharing, and sale
                    of personal data to what is strictly necessary for requested
                    platform functions unless informed consent is obtained as
                    required by the New York Child Data Protection Act. If you
                    believe a minor&apos;s information was handled improperly,
                    contact us so we can review the situation.
                </p>
            </>
        ),
    },
    {
        id: "changes",
        title: "Changes to this policy",
        content: (
            <p>
                We may update this Privacy Policy as JobsSpot features, service
                providers, business practices, or legal requirements change. We
                will update the date at the top of this page and provide
                additional notice when a change is material and notice is
                required.
            </p>
        ),
    },
    {
        id: "contact",
        title: "Contact us",
        content: (
            <p>
                For privacy questions or requests, use the <LegalContentLink href="/#contact">JobsSpot contact form</LegalContentLink>. Include enough information for us to understand and verify your request, but do not submit passwords or unnecessary sensitive information.
            </p>
        ),
    },
] as const;

export default function PrivacyPolicyPage() {
    return (
        <LegalDocumentPage
            eyebrow="Your information"
            title="Privacy Policy"
            description="This policy explains what JobsSpot collects, why we use it, when it may be shared, and the choices available to you."
            effectiveDate={effectiveDate}
            lastUpdated={effectiveDate}
            sections={sections}
        />
    );
}
