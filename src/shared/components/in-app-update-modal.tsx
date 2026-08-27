import React, { useState, useRef } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import * as Linking from "expo-linking";
import * as Haptics from "expo-haptics";
import { LucideIcon } from "@/src/shared/components/icons";
import { useAppColors } from "@/src/theme/theme-provider";
import { AppText as Text, Card, PrimaryButton } from "@/src/theme/app-ui";
import type { ReleaseInfo } from "@/src/shared/utils/update-checker";
import type { AppLanguage } from "@/src/types/app";

interface InAppUpdateModalProps {
  visible: boolean;
  releaseInfo?: ReleaseInfo;
  language: AppLanguage;
  onClose: () => void;
}

export function InAppUpdateModal({
  visible,
  releaseInfo,
  language,
  onClose,
}: InAppUpdateModalProps) {
  const colors = useAppColors();

  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedMB, setDownloadedMB] = useState("0");
  const [totalMB, setTotalMB] = useState("0");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloadedFileUri, setDownloadedFileUri] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const downloadResumableRef = useRef<FileSystem.DownloadResumable | null>(null);

  if (!releaseInfo) return null;

  const handleStartDownload = async () => {
    const downloadUrl = releaseInfo.apkDownloadUrl || releaseInfo.htmlUrl;

    if (!downloadUrl.endsWith(".apk")) {
      // Fallback for non-direct apk URL
      void Linking.openURL(downloadUrl);
      onClose();
      return;
    }

    try {
      setIsDownloading(true);
      setErrorMessage(null);
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

      const targetFileUri = `${FileSystem.documentDirectory}Elet-Update-v${releaseInfo.version}.apk`;

      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        targetFileUri,
        {},
        (downloadProgressData) => {
          const written = downloadProgressData.totalBytesWritten;
          const expected = downloadProgressData.totalBytesExpectedToWrite;

          if (expected > 0) {
            const progress = written / expected;
            setDownloadProgress(Math.min(1, Math.max(0, progress)));
            setDownloadedMB((written / (1024 * 1024)).toFixed(1));
            setTotalMB((expected / (1024 * 1024)).toFixed(1));
          }
        }
      );

      downloadResumableRef.current = downloadResumable;
      const result = await downloadResumable.downloadAsync();

      if (result && result.uri) {
        setIsDownloading(false);
        setIsDownloaded(true);
        setDownloadedFileUri(result.uri);
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        // Auto trigger install prompt
        await triggerInstall(result.uri);
      }
    } catch (err: unknown) {
      setIsDownloading(false);
      const msg = err instanceof Error ? err.message : "Download failed";
      setErrorMessage(msg);
    }
  };

  const triggerInstall = async (fileUriToInstall?: string) => {
    const fileUri = fileUriToInstall || downloadedFileUri;
    if (!fileUri) return;

    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

      if (Platform.OS === "android") {
        const contentUri = await FileSystem.getContentUriAsync(fileUri);
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: contentUri,
          flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
          type: "application/vnd.android.package-archive",
        });
      } else {
        void Linking.openURL(releaseInfo.htmlUrl);
      }
    } catch {
      // Fallback to external browser download if native intent blocked
      const fallbackUrl = releaseInfo.apkDownloadUrl || releaseInfo.htmlUrl;
      void Linking.openURL(fallbackUrl);
    }
  };

  const progressPercent = Math.round(downloadProgress * 100);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
          {/* Header */}
          <View style={[styles.headerRow, { borderBottomColor: colors.border }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
              <View style={[styles.iconCircle, { backgroundColor: colors.primaryContainer, borderColor: colors.primary }]}>
                <LucideIcon name="sparkles" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text tone="label" style={{ color: colors.primary, fontWeight: "800", fontSize: 11 }}>
                  {language === "am" ? "አዲስ ዝማኔ ተገኝቷል" : "NEW UPDATE READY"}
                </Text>
                <Text tone="title" style={{ fontSize: 17, fontWeight: "900", color: colors.text }}>
                  {`Elet v${releaseInfo.version}`}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.6 : 1 }]}
            >
              <LucideIcon name="close" size={22} color={colors.muted} />
            </Pressable>
          </View>

          {/* Release Notes */}
          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            <Card style={{ backgroundColor: colors.surface, borderColor: colors.border, padding: 14, gap: 8 }}>
              <Text tone="label" style={{ fontSize: 11, fontWeight: "800", color: colors.primary }}>
                {language === "am" ? "ምን አዲስ ነገር አለ?" : "WHAT'S NEW IN THIS VERSION"}
              </Text>
              <Text style={{ fontSize: 13, lineHeight: 19, color: colors.text }}>
                {releaseInfo.body ||
                  (language === "am"
                    ? "የአፈጻጸም ማሻሻያዎች፣ የባሕረ ሐሳብ ቀመር ማስተካከያዎች እና የደወል ስርዓት ማሻሻያ ተካቷል።"
                    : "Performance enhancements, liturgical calculation updates and alarm reliability improvements.")}
              </Text>
            </Card>

            {/* Download Progress Card */}
            {isDownloading && (
              <Card style={{ backgroundColor: colors.surface, borderColor: colors.primary, padding: 14, gap: 10, borderWidth: 1.5 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text tone="title" style={{ fontSize: 13, fontWeight: "800", color: colors.text }}>
                    {language === "am" ? "በማውረድ ላይ..." : "Downloading Update..."}
                  </Text>
                  <Text tone="label" style={{ fontSize: 13, fontWeight: "900", color: colors.primary }}>
                    {`${progressPercent}%`}
                  </Text>
                </View>

                {/* Progress Track */}
                <View style={[styles.progressTrack, { backgroundColor: colors.secondary }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: colors.primary,
                        width: `${progressPercent}%`,
                      },
                    ]}
                  />
                </View>

                <Text style={{ fontSize: 11, color: colors.muted, textAlign: "right" }}>
                  {`${downloadedMB} MB / ${totalMB || "~30"} MB`}
                </Text>
              </Card>
            )}

            {/* Download Complete Confirmation Card */}
            {isDownloaded && (
              <Card style={{ backgroundColor: colors.primaryContainer, borderColor: colors.primary, padding: 14, gap: 6, borderWidth: 1.5 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <LucideIcon name="check" size={18} color={colors.primary} strokeWidth={2.8} />
                  <Text tone="title" style={{ fontSize: 14, fontWeight: "800", color: colors.primary }}>
                    {language === "am" ? "ዝማኔው ወርዷል!" : "Download Complete!"}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: colors.text }}>
                  {language === "am"
                    ? "አዲሱ ስሪት ወደ ስልክዎ ወርዷል። ለመጫን ከታች ያለውን አዝራር ይጫኑ።"
                    : "The update APK is saved locally. Tap below to install."}
                </Text>
              </Card>
            )}

            {/* Error Display */}
            {errorMessage && (
              <Card style={{ backgroundColor: colors.dangerContainer, borderColor: colors.danger, padding: 12 }}>
                <Text style={{ fontSize: 12, color: colors.danger, fontWeight: "700" }}>
                  {`${language === "am" ? "ማውረድ አልተሳካም" : "Download Error"}: ${errorMessage}`}
                </Text>
              </Card>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={[styles.actionsRow, { borderTopColor: colors.border }]}>
            {!isDownloaded ? (
              <PrimaryButton
                label={
                  isDownloading
                    ? language === "am"
                      ? "በማውረድ ላይ..."
                      : "Downloading..."
                    : language === "am"
                    ? "አውርድና ጫን (~30 MB)"
                    : "Download & Install (~30 MB)"
                }
                icon={isDownloading ? "refresh" : "sparkles"}
                disabled={isDownloading}
                onPress={handleStartDownload}
              />
            ) : (
              <PrimaryButton
                label={language === "am" ? "አሁን ጫን (Install Now)" : "Install Now"}
                icon="check"
                onPress={() => void triggerInstall()}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1.5,
    maxHeight: "85%",
    paddingBottom: 24,
    ...Platform.select({
      web: { boxShadow: "0px -8px 24px rgba(0, 0, 0, 0.35)" },
      default: { elevation: 16 },
    }),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollArea: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 16,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  actionsRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});
