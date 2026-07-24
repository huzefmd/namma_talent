import Link from "next/link";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-mist text-ink">

            {/* Header */}
            <header className="border-b border-black/[0.06] bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-5">

                    <Link
                        href="/"
                        className="font-display text-xl font-extrabold text-ink"
                    >
                        Namma<span className="text-brand">Talent</span>
                    </Link>

                    <Link
                        href="/"
                        className="text-sm font-semibold text-brand hover:underline"
                    >
                        ← Back to Home
                    </Link>

                </div>
            </header>

            {/* Terms */}
            <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">

                <div className="mb-10">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
                        Legal
                    </p>

                    <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                        Terms & Conditions
                    </h1>

                    <p className="mt-3 text-sm text-ink/50">
                        Last updated: August 02, 2026
                    </p>
                </div>

                <div className="rounded-3xl border border-black/[0.07] bg-white p-6 shadow-sm sm:p-10">

                    <h2 className="text-2xl font-bold">
                        1. Acceptance of Terms
                    </h2>

                    <p className="mt-4 leading-8 text-ink/70">
                        By accessing or using Namma Talent, you agree to be bound by these
                        Terms & Conditions. If you do not agree with these terms, please do
                        not use our services.
                    </p>

                    <h2 className="mt-10 text-2xl font-bold">
                        2. About Namma Talent
                    </h2>

                    <p className="mt-4 leading-8 text-ink/70">
                        Namma Talent is a talent marketplace that helps users discover
                        professionals and allows professionals to showcase their skills and
                        services.
                    </p>

                    <h2 className="mt-10 text-2xl font-bold">
                        3. User Accounts
                    </h2>

                    <p className="mt-4 leading-8 text-ink/70">
                        Users are responsible for providing accurate information and
                        keeping their account credentials secure. You are responsible for
                        all activity that occurs through your account.
                    </p>

                    <h2 className="mt-10 text-2xl font-bold">
                        4. Professional Profiles
                    </h2>

                    <p className="mt-4 leading-8 text-ink/70">
                        Professionals are responsible for ensuring that the information,
                        services, images, and other content on their profiles are accurate,
                        lawful, and not misleading.
                    </p>

                    <h2 className="mt-10 text-2xl font-bold">
                        5. User Conduct
                    </h2>

                    <p className="mt-4 leading-8 text-ink/70">
                        Users must not use the platform for unlawful activities, fraud,
                        harassment, abuse, impersonation, or any activity that may harm
                        other users or Namma Talent.
                    </p>

                    <h2 className="mt-10 text-2xl font-bold">
                        6. Direct Communication
                    </h2>

                    <p className="mt-4 leading-8 text-ink/70">
                        Namma Talent helps users discover and connect with professionals.
                        Any agreements, payments, or services arranged between users are
                        the responsibility of the parties involved.
                    </p>

                    <h2 className="mt-10 text-2xl font-bold">
                        7. Limitation of Liability
                    </h2>

                    <p className="mt-4 leading-8 text-ink/70">
                        Namma Talent is not responsible for the quality, safety, legality,
                        or completion of services offered by users on the platform.
                    </p>

                    <h2 className="mt-10 text-2xl font-bold">
                        8. Changes to These Terms
                    </h2>

                    <p className="mt-4 leading-8 text-ink/70">
                        We may update these Terms & Conditions from time to time. Any
                        changes will be posted on this page with an updated revision date.
                    </p>

                    <h2 className="mt-10 text-2xl font-bold">
                        9. Contact Us
                    </h2>

                    <p className="mt-4 leading-8 text-ink/70">
                        If you have any questions about these Terms & Conditions, contact
                        us at{" "}
                        <a
                            href="mailto:hello@nammatalent.com"
                            className="font-semibold text-brand hover:underline"
                        >
                            hello@nammatalent.com
                        </a>
                        .
                    </p>

                </div>

                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="inline-flex rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
                    >
                        ← Back to Namma Talent
                    </Link>
                </div>

            </section>

        </main>
    );
}