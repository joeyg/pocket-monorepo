locals {
  message_retention_seconds = 14 * 24 * 60 * 60 // 14 days until we can figure out how to get through kinesis volume at a good pace
}

resource "aws_sqs_queue" "user_items_update" {
  name                      = "${local.prefix}-UserItemsUpdate"
  message_retention_seconds = local.message_retention_seconds
  tags                      = local.tags
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.user_items_update_deadletter.arn,
    maxReceiveCount     = 20
  })

  visibility_timeout_seconds = 960 # 16 minutes
}

resource "aws_sqs_queue" "user_items_update_deadletter" {
  name = "${local.prefix}-UserItemsUpdate-Deadletter"
}

resource "aws_sqs_queue" "user_items_delete" {
  name                      = "${local.prefix}-UserItemsDelete"
  message_retention_seconds = local.message_retention_seconds
  tags                      = local.tags
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.user_items_delete_deadletter.arn,
    maxReceiveCount     = 20
  })

  visibility_timeout_seconds = 300 # 5 minutes
}

resource "aws_sqs_queue" "user_items_delete_deadletter" {
  name = "${local.prefix}-UserItemsDelete-Deadletter"
}

resource "aws_sqs_queue" "user_list_import" {
  name                      = "${local.prefix}-UserListImport"
  message_retention_seconds = local.message_retention_seconds
  tags                      = local.tags
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.user_list_import_deadletter.arn,
    maxReceiveCount     = 20
  })

  visibility_timeout_seconds = 7200 # 120 minutes
}

resource "aws_sqs_queue" "user_list_import_deadletter" {
  name = "${local.prefix}-UserListImport-Deadletter"
}

resource "aws_sqs_queue" "user_list_events" {
  name                      = "${local.prefix}-UserListEvents"
  message_retention_seconds = local.message_retention_seconds
  tags                      = local.tags
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.user_list_events_deadletter.arn,
    maxReceiveCount     = 20
  })

  visibility_timeout_seconds = 7200 # 120 minutes
}

resource "aws_sqs_queue" "user_list_events_deadletter" {
  name = "${local.prefix}-UserListEvents-Deadletter"
}

resource "aws_sqs_queue" "corpus_events" {
  name                      = "${local.prefix}-CorpusEvents"
  message_retention_seconds = 86400
  tags                      = local.tags
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.corpus_events_deadletter.arn,
    maxReceiveCount     = 3
  })

  visibility_timeout_seconds = 500
}

resource "aws_sqs_queue" "corpus_events_deadletter" {
  name = "${local.prefix}-CorpusEvents-Deadletter"
}

resource "aws_sqs_queue" "corpus_events_hydration" {
  name                      = "${local.prefix}-CorpusParserHydrator"
  message_retention_seconds = 86400
  tags                      = local.tags
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.corpus_events_deadletter.arn,
    maxReceiveCount     = 3
  })
  delay_seconds              = 500 # Delay to avoid concurrent document updates
  visibility_timeout_seconds = 500
}

resource "aws_sqs_queue" "corpus_events_hydration_deadletter" {
  name = "${local.prefix}-CorpusParserHydrator-Deadletter"
}
