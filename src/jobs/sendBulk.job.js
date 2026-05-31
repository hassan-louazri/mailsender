async function runSendBulkJob({
    app,
    targetListPath,
    templatePath,
    subject,
    attachments = [],
}) {
    const { fileReader, MessageRenderer, mailer, rateLimiter } = app;

    const contacts = fileReader.read(targetListPath);
    const template = fileReader.read(templatePath);

    const renderer = new MessageRenderer(template);
    const messages = renderer.render(subject, contacts);

    const results = [];
    let i = 0;
    const total = messages.length;
    for (const message of messages) {
        const result = await mailer.sendOne(message, attachments);
        results.push(result);
        console.log(`[${++i}/${total}] Sending message to ${message.email}...`);
        await rateLimiter.wait(10000);
        if (i % 10 === 0) await rateLimiter.wait(990000);
    }

    return results;
}

module.exports = runSendBulkJob;
