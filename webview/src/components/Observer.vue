<script>
import {
    defineComponent, onMounted, onUnmounted, ref
} from 'vue';

export default defineComponent({
    setup(props, { emit }) {
        const trigger = ref();
        const options = {
            root: null,
            threshold: 1
        };
        let observer = undefined;
        const handleIntersect = (entry) => {
            if (entry.isIntersecting) emit('triggerIntersected', trigger.value);
        };

        onMounted(() => {
            try {
                observer = new IntersectionObserver((entries) => {
                    handleIntersect(entries[0]);
                }, options);
                observer.observe(trigger.value);
            } catch (err) {
                console.error(err);
            }
        });

        onUnmounted(() => {
            if (observer != null) {
                observer.disconnect(); // IntersectionObserver 객체가 생성된 후에만 disconnect() 메서드 호출
            }
        });

        return {
            trigger
        };
    }
});
</script>
<template>
    <div ref="trigger" class="text-center">.</div>
</template>