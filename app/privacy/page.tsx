import Link from "next/link";

export default function PrivacyPolicyPage() {
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

            {/* Privacy Policy */}
            <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">

                <div className="mb-10">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
                        Legal
                    </p>

                    <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                        Privacy Policy
                    </h1>

                    <p className="mt-3 text-sm text-ink/50">
                        Last updated: August 02, 2026
                    </p>
                </div>

                <div className="rounded-3xl border border-black/[0.07] bg-white p-6 shadow-sm sm:p-10">

                    <p className="leading-8 text-ink/70">
                        This Privacy Policy explains how Namma Talent collects, uses,
                        stores, and protects your personal information when you use our
                        website and services.
                    </p>

                    <h2 className="mt-10 text-2xl font-bold">
                        1. What Information Do We Collect?
                    </h2>

                    <p className="mt-4 leading-8 text-ink/70">
                        When you visit, use, or navigate our services, we may process
                        personal information depending on how you interact with us and the
                        services, the choices you make, and the products and features you
                        use.
                    </p>

                    <h2 className="mt-10 text-2xl font-bold">
                        2. How Do We Process Your Information?
                    </h2>

                    <p className="mt-4 leading-8 text-ink/70">
                        We process your information to provide, improve, and administer
                        our services, communicate with you, maintain security, prevent
                        fraud, and comply with applicable laws.
                    </p>

                    <h2 className="mt-10 text-2xl font-bold">
                        3. When and With Whom Do We Share Your Information?
                    </h2>

                    <p className="mt-4 leading-8 text-ink/70">
                        We may share information only in specific situations and with
                        service providers or other parties when necessary to provide and
                        operate our services.
                    </p>

                    <h2 className="mt-10 text-2xl font-bold">
                        4. Do We Use Cookies?
                    </h2>

                    <p className="mt-4 leading-8 text-ink/70">
                        We may use cookies and similar technologies to help operate our
                        website, improve user experience, and understand how our services
                        are used.
                    </p>

                    <h2 className="mt-10 text-2xl font-bold">
                        5. How Do We Keep Your Information Safe?
                    </h2>

                    <p className="mt-4 leading-8 text-ink/70">
                        We use reasonable organisational and technical safeguards to
                        protect your personal information. However, no electronic
                        transmission or storage system can be guaranteed to be completely
                        secure.
                    </p>

                    <h2 className="mt-10 text-2xl font-bold">
                        6. What Are Your Privacy Rights?
                    </h2>

                    <p className="mt-4 leading-8 text-ink/70">
                        Depending on your location and applicable law, you may have rights
                        regarding your personal information, including rights to request
                        access, correction, or deletion of your information.
                    </p>

                    <h2 className="mt-10 text-2xl font-bold">
                        7. Contact Us
                    </h2>

                    <p className="mt-4 leading-8 text-ink/70">
                        If you have any questions or concerns about this Privacy Policy,
                        please contact us at{" "}
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