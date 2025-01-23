export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                <p className="mb-4">
                    We only collect information that is necessary for the functioning of our YouTube Playlist Organiser. This includes:
                </p>
                <ul className="list-disc ml-6 mb-4">
                    <li>YouTube account access permissions (when authorized)</li>
                    <li>Playlist data and organization preferences</li>
                    <li>Basic usage statistics</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                <p className="mb-4">
                    The information we collect is used solely for:
                </p>
                <ul className="list-disc ml-6 mb-4">
                    <li>Managing and organizing your YouTube playlists</li>
                    <li>Improving our service functionality</li>
                    <li>Providing technical support</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                <p className="mb-4">
                    We implement appropriate security measures to protect your information. Your data is never sold to third parties.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p>
                    If you have any questions about our privacy policy, please contact us at{' '}
                    <a href="mailto:falsegenius1@gmail.com" className="text-blue-600 hover:underline">
                        falsegenius1@gmail.com
                    </a>
                </p>
            </section>
        </div>
    );
}