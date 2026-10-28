import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const content = `<p>Most teams spend months polishing onboarding and almost no time on the opposite end of the journey: the moment a customer decides to leave. That's a missed opportunity. The cancel flow is one of the few moments where a customer tells you, clearly and honestly, what isn't working. It is also the last chance to earn them back.</p>

<p>Mobbin recently studied 393 cancel flows, together with Daniel Hall from Churnkey, a retention platform that sits right behind the cancel button for subscription companies. Churnkey's data comes from more than 12 million cancellation sessions and 500 million billing events, and it has helped recover close to $300 million in revenue. The question behind the study was simple: how do you design a cancel flow that makes people stay, minus the dark patterns?</p>

<p>A quick note on scope. "Cancel flow" here means cancelling a subscription. It does not mean deleting an account, cancelling an order, or the Cancel button on a confirmation dialog.</p>

<h2>1. A Cancel Flow Is a Conversation, Not a Wall</h2>

<p>The worst cancel flows treat leaving as a problem to be blocked. Hidden buttons, guilt-trip copy, and endless confirmation screens might hold a few people for a month, but they turn quiet churners into angry ones, and angry ones leave reviews.</p>

<p>The best flows do the opposite. They treat cancellation as a conversation: <em>Why are you leaving? Is there something we can change for you? If not, no hard feelings.</em> The goal isn't to trap people. It's to offer the right alternative at the right moment, and let go gracefully when there isn't one.</p>

<h2>2. How Much Discount Should You Offer?</h2>

<p>Discounts are the most common save offer, and the easiest to get wrong. A few principles hold up:</p>

<ul>
  <li><strong>Match the offer to the reason.</strong> A discount helps when the reason is price. It does nothing for someone who says "I don't use it anymore."</li>
  <li><strong>Don't lead with your biggest discount.</strong> If the first offer is already the deepest cut, you've got nowhere to go and you've taught customers that threatening to cancel is how you get a deal.</li>
  <li><strong>Time-box it.</strong> A discount for a few months, then back to the regular price, protects your margins better than a permanent price cut.</li>
</ul>

<p>Think of the discount as a tool for specific situations, not a default reaction to every cancellation.</p>

<h2>3. Pause Instead of Cancel</h2>

<p>Sometimes people don't want to leave. They just don't need the product <em>right now</em>: seasonal work, a busy quarter, a trip, a tight month.</p>

<p>A pause option fits those cases perfectly. The customer keeps their data, their settings, and their history, and you keep the relationship. Without a pause option, "cancel" is the only button that matches how they feel, so that's the one they press.</p>

<p>Good pause design is simple: let them choose a clear duration, tell them exactly when billing resumes, and remind them before it does.</p>

<h2>4. Downgrade or Switch Plans</h2>

<p>Not every cancellation is about the product. Often it's about the <em>plan</em>. The customer may be paying for seats, limits, or features they never use.</p>

<p>Offering a cheaper or lighter plan at the cancel moment turns a lost customer into a smaller, but still active, one. A smaller subscription that continues is usually worth far more than a larger one that ended, especially if the customer grows back into the bigger plan later.</p>

<h2>5. Free Trial Extensions</h2>

<p>For people cancelling during a trial, the reason is often not "this is bad." It's "I haven't had time to try it properly."</p>

<p>An extended trial answers that objection directly, because it gives them what they were missing: time. It works best when it's paired with a nudge toward the one feature or workflow that would make the product click for them, so the extra days actually lead to value.</p>

<h2>6. What If They Turn Down Every Offer?</h2>

<p>Here's where respect matters most. If someone has seen your offers and still wants to leave, the flow should let them leave. Pushing a fourth and fifth offer is where good retention design slides into dark patterns.</p>

<p>The right move at that point:</p>

<ol>
  <li>Confirm the cancellation clearly.</li>
  <li>State what happens next: the date access ends, what happens to their data, and whether they can come back.</li>
  <li>Leave the door open, with an easy way to reactivate later.</li>
</ol>

<p>A customer who leaves on good terms is far more likely to return than one who had to fight to go.</p>

<h2>7. How to Design an Exit Survey</h2>

<p>An exit survey is the most valuable data you will collect all year, but only if you design it well.</p>

<ul>
  <li><strong>Keep it short.</strong> One required question is better than ten optional ones. Every extra field is another reason to abandon the form.</li>
  <li><strong>Offer clear, mutually exclusive reasons.</strong> "Too expensive," "Missing a feature," "Switching to another tool," "Not using it enough," and "Other" will cover most cases and make the data easy to analyze.</li>
  <li><strong>Make the answer drive the next screen.</strong> If someone picks "too expensive," show the discount or downgrade. If they pick "missing a feature," show the roadmap or a way to contact the team. A survey that doesn't change what happens next is just a form.</li>
  <li><strong>Don't punish honesty.</strong> The reason they pick shouldn't make the flow harder.</li>
</ul>

<p>Done well, the exit survey is both a retention tool and a product research tool.</p>

<h2>8. Make Cancelling Easy</h2>

<p>This sounds counterintuitive, but it's the most important principle in the whole study: <strong>easy cancellation builds trust, and trust is what brings people back.</strong></p>

<p>Customers should be able to find the cancel option without hunting for it, complete it in a few steps, and get a clear confirmation. Beyond being the right thing to do, regulators in many regions are increasingly requiring it. A flow that depends on confusion to keep revenue is a liability, not a strategy.</p>

<p>One more thing worth remembering: on iOS, most subscriptions are cancelled through Settings → Subscriptions, not inside the app. That means app teams have less control over the cancel moment on iPhone, and it makes the in-app experience, the messaging before that point, and win-back communication even more important.</p>

<h2>9. Know Your Benchmarks and Track the Right Metrics</h2>

<p>You can't improve what you don't measure, and a cancel flow gives you plenty to measure. Useful numbers to track include:</p>

<ul>
  <li><strong>Save rate:</strong> the share of cancellation attempts that end in the customer staying.</li>
  <li><strong>Offer acceptance by type:</strong> which offers (discount, pause, downgrade, extension) actually work, and for which reasons.</li>
  <li><strong>Reason distribution:</strong> why people leave, and how that shifts over time.</li>
  <li><strong>Retention after the save:</strong> whether customers who accepted an offer are still active months later. A "save" that churns in 30 days isn't a real save.</li>
  <li><strong>Voluntary churn rate:</strong> compared against benchmarks for your industry, since a healthy rate for one category can be a problem in another.</li>
</ul>

<p>Churnkey, in collaboration with Stripe, publishes voluntary churn benchmarks, and they're a useful reference point when you're deciding whether your numbers need attention.</p>

<h2>What This Means for Designers and Product Teams</h2>

<p>If you design subscription products, here is the short version:</p>

<ol>
  <li><strong>Treat the cancel flow as part of the product,</strong> not an afterthought handed to billing.</li>
  <li><strong>Match each offer to the reason for leaving.</strong></li>
  <li><strong>Give people a way to pause or downsize</strong> before you give them a way to leave.</li>
  <li><strong>Let go gracefully</strong> when they've heard your offers and still want out.</li>
  <li><strong>Use the exit survey</strong> as a source of insight, not a hurdle.</li>
  <li><strong>Measure saves over time,</strong> not just at the moment of cancellation.</li>
</ol>

<p>A good cancel flow won't save every customer, and it shouldn't try to. What it should do is make sure the people who could have stayed were given a real reason to, and that the people who leave do so with their trust in your product intact.</p>

<hr />

<p><em>This article was inspired by the video <strong>"We Studied 393 Cancel Flows. This Wins People Back."</strong> by Mobbin, featuring insights from Daniel Hall of Churnkey. Watch it here: <a href="https://www.youtube.com/watch?v=MQOfPYSYr70" target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v=MQOfPYSYr70</a></em></p>`

async function main() {
  const blog = await prisma.blog.create({
    data: {
      title: 'Designing Cancel Flows That Win People Back (Without the Dark Patterns)',
      slug: 'designing-cancel-flows-that-win-people-back',
      excerpt: 'What 393 cancellation flows teach us about retention, respect, and the last screen your customer sees. A guide to designing cancel flows that offer real alternatives, let go gracefully, and leave customers with their trust intact.',
      content,
      tags: ['ux', 'design', 'product', 'subscription', 'retention'],
      isPublished: false,
      index: 0,
    }
  })

  console.log('✅ Draft article created!')
  console.log('ID:', blog.id)
  console.log('Slug:', blog.slug)
  console.log('Title:', blog.title)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
