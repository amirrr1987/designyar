import type { Component } from 'vue'
import {
  AimOutlined,
  AuditOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  ExperimentOutlined,
  HeartOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons-vue'

/** Explicit map from Design Thinking `icon` string names → components. */
export const STEP_ICON_MAP: Record<string, Component> = {
  HeartOutlined,
  AimOutlined,
  BulbOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  AuditOutlined,
}

export function resolveStepIcon(name: string): Component {
  return STEP_ICON_MAP[name] ?? QuestionCircleOutlined
}
