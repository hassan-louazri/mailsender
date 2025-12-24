async function runSendBulkJob({
    app,
    targetListPath,
    templatePath,
    subject,
    attachments = [],
}) {
    const { fileReader, MessageRenderer, mailer, logger } = app;

    logger.info("Job 'Send Bulk Emails' started...");

    const contacts = fileReader.read(targetListPath);
    const template = fileReader.read(templatePath);

    const renderer = new MessageRenderer(template);
    const messages = renderer.render(subject, contacts);

    const results = [];

    for (const message of messages) {
        const result = await mailer.sendOne(message, attachments);
        results.push(result);
    }

    logger.info("Job 'Send Bulk Emails' finished.", {
        total: results.length,
        success: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
    });

    return results;
}

module.exports = runSendBulkJob;
