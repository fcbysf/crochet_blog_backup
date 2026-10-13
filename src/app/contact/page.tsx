import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitting(false);
    setName("");
    setEmail("");
    setMessage("");
    setSuccess(true);
  };

  if (success) {
    return (
      <main className="pt-20 pb-12">
        <div className="mx-auto max-w-md px-6 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4 dark:text-zinc-100">
            Message Sent
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
Thank you for contacting us! We will get back to you soon.
</p>
          <Link to="/" className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 pb-12">
      <div className="mx-auto max-w-md px-6">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4 dark:text-zinc-100">
            Contact Us
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 px-3 text-sm text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
                required
                aria-label="Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 px-3 text-sm text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
                required
                aria-label="Email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                rows={4}
                className="w-full rounded-lg border border-zinc-300 bg-white py-3 px-3 text-sm text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500"
                required
                aria-label="Message"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
            >
              {submitting
                ? "Sending..."
                : "Send Message"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}