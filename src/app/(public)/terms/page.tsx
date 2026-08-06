import type { Metadata } from "next";

import LegalDocumentPage, {
    LegalContentLink,
} from "@/features/legal/components/LegalDocumentPage";

export const metadata: Metadata = {
    title: "Terms and Conditions",
    description:
        "Review the rules and responsibilities that apply when using JobsSpot.",
};

const effectiveDate = "August 6, 2026";

const sections = [
    {
        id: "acceptance",
        title: "Acceptance of these Terms",
        content: (
            <>
                <p>
                    These Terms and Conditions govern your access to and use of
                    JobsSpot, including its public job pages, accounts,
                    applications, resumes, company workspaces, employer tools,
                    team invitations, email features, and related services.
                </p>
                <p>
                    By accessing or using JobsSpot, you agree to these Terms and
                    our <LegalContentLink href="/privacy">Privacy Policy</LegalContentLink>. If you do not agree, do not use the platform.
                </p>
            </>
        ),
    },
    {
        id: "platform-role",
        title: "What JobsSpot provides",
        content: (
            <>
                <p>
                    JobsSpot provides technology that helps job seekers discover
                    opportunities, prepare profiles and resumes, submit
                    applications, and track activity. It also helps employers
                    create company workspaces, publish jobs, receive applications,
                    and manage recruitment workflows.
                </p>
                <p>
                    Unless expressly stated otherwise, JobsSpot is not the
                    employer, recruiter, staffing agency, representative, or
                    agent of any user. We do not make hiring decisions and do not
                    guarantee that a job listing, applicant, interview, offer,
                    hire, salary, company, or other outcome is accurate,
                    available, suitable, or successful.
                </p>
            </>
        ),
    },
    {
        id: "eligibility-accounts",
        title: "Eligibility and accounts",
        content: (
            <>
                <p>
                    You must be at least 13 years old and have the legal
                    capacity to accept these Terms and use JobsSpot for lawful
                    employment or recruitment purposes. If you are under the age
                    of majority where you live, you may use JobsSpot only with the
                    involvement and permission of a parent or legal guardian where
                    required by law. If you use JobsSpot on behalf of a company or
                    organization, you represent that you are authorized to bind or
                    act for that organization within the permissions assigned to
                    you.
                </p>
                <p>You agree to:</p>
                <ul>
                    <li>provide accurate, current, and complete information;</li>
                    <li>keep your login credentials and email account secure;</li>
                    <li>use only accounts and company workspaces you are authorized to access;</li>
                    <li>promptly update information that becomes inaccurate;</li>
                    <li>notify JobsSpot if you suspect unauthorized access or account misuse.</li>
                </ul>
                <p>
                    You are responsible for activity performed through your
                    account, except to the extent caused by a failure of JobsSpot
                    that cannot reasonably be attributed to you.
                </p>
            </>
        ),
    },
    {
        id: "job-seekers",
        title: "Job-seeker responsibilities",
        content: (
            <>
                <p>Job seekers must:</p>
                <ul>
                    <li>submit truthful profile, education, employment, certification, skill, and resume information;</li>
                    <li>apply only for legitimate personal employment purposes;</li>
                    <li>ensure they have the right to share documents and information included in an application;</li>
                    <li>communicate professionally and avoid impersonation, fraud, harassment, or misleading claims;</li>
                    <li>independently evaluate employers, job terms, interviews, requests, and offers before taking action.</li>
                </ul>
                <p>
                    Never send money, passwords, one-time codes, banking
                    credentials, or unrelated identity documents merely to apply
                    for a job. Report suspicious listings or communications when
                    a reporting channel is available, or contact JobsSpot.
                </p>
            </>
        ),
    },
    {
        id: "employers",
        title: "Employer responsibilities",
        content: (
            <>
                <p>Employers and company team members must:</p>
                <ul>
                    <li>represent a legitimate organization or authorized hiring activity;</li>
                    <li>publish accurate job titles, descriptions, locations, workplace arrangements, qualifications, compensation information, deadlines, and status;</li>
                    <li>use applicant data only for lawful recruitment and related recordkeeping;</li>
                    <li>respect equal-opportunity, labor, anti-discrimination, privacy, consumer, pay-transparency, and other applicable laws;</li>
                    <li>protect resumes and applicant information from unauthorized access, sharing, or misuse;</li>
                    <li>keep company and job information current and remove or update roles that are no longer available.</li>
                </ul>
                <p>
                    Employers are solely responsible for their recruitment
                    decisions, communications, screening practices, interviews,
                    offers, employment relationships, and compliance obligations.
                    For job advertisements covered by New York law, this includes
                    applicable compensation-range, commission, and job-description
                    disclosure requirements.
                </p>
            </>
        ),
    },
    {
        id: "company-roles",
        title: "Company workspaces, invitations, and roles",
        content: (
            <>
                <p>
                    Company owners and authorized administrators may invite users
                    and assign workspace roles such as Owner, Admin, Recruiter,
                    or Viewer. Each role has different permissions. Users must not
                    attempt to bypass role restrictions or exercise authority they
                    have not been granted.
                </p>
                <p>
                    Invitation links are private, limited-use credentials. Do not
                    publish, forward, sell, or intentionally expose them. A
                    company is responsible for reviewing its active members,
                    removing access when no longer needed, and transferring
                    ownership carefully.
                </p>
            </>
        ),
    },
    {
        id: "job-posting-rules",
        title: "Job-posting rules",
        content: (
            <>
                <p>You may not post or promote:</p>
                <ul>
                    <li>false, misleading, duplicate, expired, or unavailable jobs;</li>
                    <li>roles designed to collect personal information without a genuine hiring purpose;</li>
                    <li>advance-fee, investment, pyramid, money-transfer, reshipping, identity-theft, or other fraudulent schemes;</li>
                    <li>unlawful, discriminatory, exploitative, abusive, obscene, dangerous, or rights-infringing content;</li>
                    <li>jobs that conceal material conditions, impersonate another organization, or misuse a third party&apos;s name or branding;</li>
                    <li>content containing malware, unauthorized tracking, or links intended to compromise users.</li>
                </ul>
                <p>
                    JobsSpot may remove, pause, archive, restrict, or investigate
                    listings that appear to violate these Terms, applicable law,
                    or platform safety requirements.
                </p>
            </>
        ),
    },
    {
        id: "applications-communications",
        title: "Applications and communications",
        content: (
            <>
                <p>
                    When a job seeker submits an application, JobsSpot provides
                    the application and selected resume to the relevant employer.
                    Employers may update application statuses and communicate
                    with applicants. Status labels are workflow tools and do not
                    create a guarantee, contract, offer, or employment right.
                </p>
                <p>
                    Users are responsible for verifying the identity and
                    legitimacy of people they communicate with. JobsSpot may send
                    transactional messages necessary to operate accounts,
                    security, applications, invitations, and support features.
                </p>
            </>
        ),
    },
    {
        id: "content-license",
        title: "Your content and platform rights",
        content: (
            <>
                <p>
                    You retain ownership of content you lawfully submit. You grant
                    JobsSpot a non-exclusive, worldwide, royalty-free license to
                    host, store, reproduce, format, display, transmit, and process
                    that content only as reasonably necessary to operate, secure,
                    promote, and improve the services you use.
                </p>
                <p>
                    You represent that you have the rights and permissions needed
                    to submit the content and that it does not violate law or the
                    rights of another person. JobsSpot&apos;s software, design,
                    branding, documentation, and original platform content remain
                    protected by applicable intellectual-property laws.
                </p>
            </>
        ),
    },
    {
        id: "prohibited-conduct",
        title: "Prohibited conduct",
        content: (
            <>
                <p>You must not:</p>
                <ul>
                    <li>access accounts, resumes, applications, company workspaces, or systems without authorization;</li>
                    <li>scrape, harvest, copy, resell, or build databases from JobsSpot content except where expressly permitted;</li>
                    <li>send spam, automate abusive requests, evade rate limits, or interfere with platform operation;</li>
                    <li>upload malicious code or attempt to test, probe, bypass, or exploit security controls without written authorization;</li>
                    <li>impersonate another person or company, create deceptive accounts, or manipulate platform records;</li>
                    <li>use JobsSpot to violate privacy, labor, intellectual-property, anti-fraud, anti-discrimination, or other applicable laws;</li>
                    <li>help another person do anything prohibited by these Terms.</li>
                </ul>
            </>
        ),
    },
    {
        id: "moderation",
        title: "Moderation, suspension, and enforcement",
        content: (
            <>
                <p>
                    JobsSpot may review reported or suspicious activity and may
                    warn, restrict, suspend, or terminate accounts; remove or
                    limit content; revoke sessions; preserve evidence; or refer a
                    matter to appropriate authorities when reasonably necessary.
                </p>
                <p>
                    Enforcement decisions may consider the nature, severity,
                    frequency, evidence, risk to users, legal obligations, and
                    available technical information. We may act without advance
                    notice where immediate action is reasonably necessary for
                    security, fraud prevention, legal compliance, or user safety.
                </p>
            </>
        ),
    },
    {
        id: "third-party-services",
        title: "Third-party services and links",
        content: (
            <p>
                JobsSpot relies on and may link to third-party services, including
                authentication, email, storage, media, hosting, and employer
                websites. Their services may be governed by separate terms and
                privacy policies. JobsSpot is not responsible for third-party
                content, availability, security, promises, or transactions that
                occur outside our control.
            </p>
        ),
    },
    {
        id: "beta-fees",
        title: "Beta services, pricing, and future paid features",
        content: (
            <>
                <p>
                    JobsSpot may make some or all services available without
                    charge during a beta or introductory period. Free access does
                    not guarantee that every feature will remain free or available
                    indefinitely.
                </p>
                <p>
                    If paid plans or services are introduced, the applicable
                    price, billing period, included features, limits, renewal,
                    cancellation, and refund terms will be displayed before you
                    purchase. Additional billing terms may apply, and we will not
                    charge you without an authorized transaction.
                </p>
            </>
        ),
    },
    {
        id: "availability-changes",
        title: "Availability and changes to the service",
        content: (
            <p>
                We may add, modify, limit, suspend, or discontinue features to
                improve the platform, address security or legal requirements,
                manage capacity, or respond to business needs. We aim to operate
                JobsSpot reliably but do not guarantee uninterrupted,
                error-free, or permanently available service.
            </p>
        ),
    },
    {
        id: "disclaimers",
        title: "Disclaimers",
        content: (
            <>
                <p>
                    To the maximum extent permitted by law, JobsSpot is provided
                    on an <strong>“as is”</strong> and <strong>“as available”</strong>
                    basis. We disclaim warranties that are not expressly stated,
                    including implied warranties of merchantability, fitness for
                    a particular purpose, non-infringement, accuracy, and
                    availability.
                </p>
                <p>
                    JobsSpot does not verify every user, company, credential,
                    resume, job, statement, communication, or external link. You
                    must use reasonable care and independent judgment before
                    sharing information, attending an interview, accepting an
                    offer, making a hiring decision, or entering any agreement.
                </p>
            </>
        ),
    },
    {
        id: "limitation-liability",
        title: "Limitation of liability",
        content: (
            <p>
                To the maximum extent permitted by applicable law, JobsSpot and
                its operators, personnel, and service providers will not be liable
                for indirect, incidental, special, consequential, exemplary, or
                punitive damages; lost opportunities, profits, data, goodwill, or
                business; or harm arising from user conduct, employer decisions,
                job listings, applications, communications, third-party services,
                unauthorized access, or service interruption. Nothing in these
                Terms excludes liability that cannot lawfully be excluded.
            </p>
        ),
    },
    {
        id: "indemnity",
        title: "Your responsibility for claims",
        content: (
            <p>
                To the extent permitted by law, you agree to be responsible for
                claims, losses, liabilities, and reasonable costs arising from
                your unlawful use of JobsSpot, your content, your hiring or
                employment practices, your violation of these Terms, or your
                infringement of another person&apos;s rights. This section does not
                apply where a claim was caused by JobsSpot&apos;s own unlawful conduct.
            </p>
        ),
    },
    {
        id: "termination",
        title: "Ending your use of JobsSpot",
        content: (
            <>
                <p>
                    You may stop using JobsSpot at any time. Account-deletion or
                    data requests may be submitted through available account
                    controls or the contact form. Certain records may be retained
                    where reasonably necessary for security, audit, dispute,
                    contractual, or legal purposes.
                </p>
                <p>
                    Provisions that by their nature should survive termination,
                    including ownership, disclaimers, limitations of liability,
                    responsibility for claims, and dispute provisions, will
                    continue to apply.
                </p>
            </>
        ),
    },
    {
        id: "governing-law",
        title: "Governing law and disputes",
        content: (
            <p>
                These Terms are governed by the laws of the State of New York and
                applicable federal law of the United States, without regard to
                conflict-of-law principles. Before starting formal proceedings,
                you agree to contact JobsSpot and make a reasonable effort to
                resolve the concern informally. Subject to rights and remedies
                that cannot lawfully be waived, disputes that cannot be resolved
                informally may be brought in a state or federal court located in
                New York State that has jurisdiction over the dispute.
            </p>
        ),
    },
    {
        id: "changes-terms",
        title: "Changes to these Terms",
        content: (
            <p>
                We may update these Terms as the platform, pricing, safety rules,
                business practices, or legal requirements change. We will update
                the date at the top of this page and provide additional notice
                when required. Continuing to use JobsSpot after revised Terms take
                effect means you accept the revised Terms, except where applicable
                law requires another form of consent.
            </p>
        ),
    },
    {
        id: "contact",
        title: "Contact us",
        content: (
            <p>
                Questions, complaints, reports, and legal notices may be submitted
                through the <LegalContentLink href="/#contact">JobsSpot contact form</LegalContentLink>. Do not include passwords or unnecessary sensitive information.
            </p>
        ),
    },
] as const;

export default function TermsAndConditionsPage() {
    return (
        <LegalDocumentPage
            eyebrow="Platform rules"
            title="Terms and Conditions"
            description="These Terms explain the responsibilities of job seekers, employers, company team members, and other users of JobsSpot."
            effectiveDate={effectiveDate}
            lastUpdated={effectiveDate}
            sections={sections}
        />
    );
}
