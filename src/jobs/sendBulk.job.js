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

    for (const message of messages) {
        const result = await mailer.sendOne(message, attachments);
        results.push(result);
        await rateLimiter.wait();
    }

    return results;
}

module.exports = runSendBulkJob;
